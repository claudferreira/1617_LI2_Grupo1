import io from 'socket.io-client'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'
import { Component } from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'

import Layout from '../components/layout'
import TrainingOverlay from '../components/training-overlay'
import { initStore, setCurrentUser } from '../helpers/store'

const canvasSize = { width: 800, height: 600 }
const recognizingIntervalTimeout = 750
const trainingPhotosCount = 50

const lastUserId = users => Object.keys(users).map(id => parseInt(id)).sort().pop() || 0

class HomePage extends Component {
  state = {
    showAddUserButton: false,
    istraining: false,
    percentage: 0,
  }

  componentDidMount () {
    const istraining = this.props.url.query.training !== undefined

    this.videoContext = this.videoCanvas.getContext('2d')

    this.overlayContext = this.overlayCanvas.getContext('2d')
    this.overlayContext.strokeStyle = 'rgb(0, 184, 174)'
    this.overlayContext.lineWidth = 4
    this.overlayContext.lineCap = 'round'
    this.overlayContext.setLineDash([2, 15])

    this.socket = io(window.location.origin)
    this.socket.on('faceDetected', this.handleFaceDetected)
    this.socket.on('userTrainned', this.handleUserTrainned)

    if (this.video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.cameraStream = stream
        this.video.src = window.URL.createObjectURL(this.cameraStream)

        this.video.play().then(() => {
          if (!istraining) {
            this.recognizingInterval = setInterval(() => {
              this.videoContext.drawImage(this.video, 0, 0, canvasSize.width, canvasSize.height)

              this.socket.emit('recognizeFace', this.videoCanvas.toDataURL('image/jpeg', 1))
            }, recognizingIntervalTimeout)
          } else {
            this.trainNewUser()
          }
        })
      })
    }
  }

  componentWillUnmount () {
    clearInterval(this.recognizingInterval)
    clearInterval(this.trainingInterval)

    if (this.video) {
      this.video.pause()
      this.cameraStream.getTracks()[0].stop()
    }

    this.socket.close()
  }

  drawFaceOverlay({ x, y, width, height }) {
    this.overlayContext.beginPath();
    this.overlayContext.arc(x + width / 2, y + width / 2, width / 1.7, 0, Math.PI * 2, true);
    this.overlayContext.stroke()

    this.lastFacePosition = { x, y, width, height }
  }

  clearFaceOverlay() {
    if (this.lastFacePosition) {
      const { x, y, width } = this.lastFacePosition

      this.overlayContext.clearRect(
        x - width / 2,
        y - width / 2,
        width * 2,
        width * 2
      )
    }
  }

  handleFaceDetected = data => {
    const { dispatch, users } = this.props
    const { id, position, ...userData} = data

    this.clearFaceOverlay()

    if (id) {
      this.setState({ showAddUserButton: false })

      dispatch(setCurrentUser({ id, ...userData }))

      Router.push('/dashboard')
    } else if (position) {
      this.drawFaceOverlay(position)

      this.setState({ showAddUserButton: true })
    }
  }

  trainNewUser = () => {
    const { users } = this.props

    clearInterval(this.recognizingInterval)
    clearInterval(this.trainingInterval)

    this.setState({
      showAddUserButton: false,
      trainingPhotoIndex: 0,
      istraining: true,
    })

    const newUserId = lastUserId(users) + 1

    this.socket.emit(`removeUser`, newUserId)

    this.trainingInterval = setInterval(() => {
      this.setState({ trainingPhotoIndex: this.state.trainingPhotoIndex + 1 }, () => {
        if (this.state.trainingPhotoIndex >= trainingPhotosCount) {
          clearInterval(this.trainingInterval)

          this.socket.emit(`trainUser`, newUserId)
        } else {
          this.videoContext.drawImage(this.video, 0, 0, canvasSize.width, canvasSize.height)

          this.socket.emit(
            `saveUserPhoto`,
            this.videoCanvas.toDataURL('image/jpeg', 1),
            newUserId,
            this.state.trainingPhotoIndex
          )
        }
      })
    }, 100)
  }

  canceltraining = () => {
    const { users } = this.props

    clearInterval(this.trainingInterval)

    const userId = lastUserId(users) + 1

    this.socket.emit(`removeUser`, userId)

    this.setState({ istraining: false, trainingPhotoIndex: 0 })
    this.goToDashboard()
  }

  handleUserTrainned = id => {
    Router.push(`/profile?id=${id}`)
  }

  goToDashboard = () => {
    Router.push('/dashboard')
  }

  render () {
    const { showAddUserButton, istraining, trainingPhotoIndex } = this.state

    return (
      <Layout>
        <div>
          <Icon loading name="spinner" size="massive" />

          <video
            ref={el => this.video = el}
            width={canvasSize.width}
            height={canvasSize.height}
            autoPlay
          />

          <canvas
            ref={el => this.videoCanvas = el}
            className="videoCanvas"
            width={canvasSize.width}
            height={canvasSize.height}
          />

          <canvas
            ref={el => this.overlayCanvas = el}
            className={`overlayCanvas ${istraining ? 'hidden' : ''}`}
            width={canvasSize.width}
            height={canvasSize.height}
          />

          { istraining
            ? (
              <div className="training-container">
                <TrainingOverlay percentage={Math.round(trainingPhotoIndex / trainingPhotosCount * 100)} />

                {trainingPhotoIndex < trainingPhotosCount
                  ? (
                    <div>
                      <Button basic inverted onClick={this.canceltraining}>Cancelar</Button>

                      <Header as="h1" textAlign="center">Criação de perfil em progresso...</Header>
                      <Header as="h3" textAlign="center">Aguarde enquanto movimenta a cabeça</Header>
                    </div>
                  )
                  : null
                }
              </div>
            )
            : null
          }

          { showAddUserButton
            ? (
              <div className="buttons">
                <Button
                  content="Adicionar Perfil"
                  icon="add user"
                  labelPosition="left"
                  color="teal"
                  size="big"
                  onClick={this.trainNewUser}
                />
                <Button
                  content="Ignorar"
                  icon="arrow right"
                  labelPosition="right"
                  size="big"
                  onClick={this.goToDashboard}
                />
              </div>
            )
            : null
          }
        </div>

        <style jsx>{`
          .videoCanvas {
            left: -100000px;
            position: absolute;
            top: -100000px;
          }

          .overlayCanvas,
          video {
            left: 0;
            position: absolute;
            top: 0;
          }

          .overlayCanvas {
            z-index: 2;
          }

          .hidden {
            display: none;
          }

          .buttons {
            left: 50%;
            position: absolute;
            bottom: 20px;
            transform: translateX(-50%);
            z-index: 3;
          }

          div :global(.spinner.icon) {
            left: 50%;
            position: absolute;
            top: 50%;
            margin: -.5em 0 0 -.5em;
          }

          .training-container {
            & div {
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              padding-bottom: 40px;
              position: absolute;
              top: 0;
              left: 0;
              bottom: 0;
              right: 0;
              z-index: 4;

              & :global(.ui.header) {
                color: #fff;
                margin: 8px 0 0 0;
              }
            }

            & :global(.ui.button) {
              position: absolute;
              top: 60px;
              right: 60px;
            }
          }
        `}</style>
      </Layout>
    )
  }
}

export default withRedux(initStore, state => state)(HomePage)
