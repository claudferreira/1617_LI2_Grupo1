import Router from 'next/router'
import withRedux from 'next-redux-wrapper'
import { Component } from 'react'
import { Header, Button, Loader, Message } from 'semantic-ui-react'

import Layout from '../components/layout'
import TrainingOverlay from '../components/training-overlay'
import { initStore, setCurrentUser } from '../helpers/store'

const canvasSize = { width: 800, height: 600 }
const recognizingIntervalTimeout = 750
const trainingPhotosCount = 50

let hideMessageTimeout
const lastUserId = users => Object.keys(users).map(id => parseInt(id)).sort().pop() || 0

class HomePage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showAddUserButton: false,
      isTraining: false,
      percentage: 0,
      savedUserName: props.url.query.saved,
    }
  }

  componentDidMount () {
    const isTraining = this.props.url.query.training !== undefined
    const { savedUserName } = this.state

    if (savedUserName) {
      hideMessageTimeout = setTimeout(this.onDismissMessage, 5000)
    }

    this.videoContext = this.videoCanvas.getContext('2d')

    this.overlayContext = this.overlayCanvas.getContext('2d')
    this.overlayContext.strokeStyle = 'rgb(0, 184, 174)'
    this.overlayContext.lineWidth = 4
    this.overlayContext.lineCap = 'round'
    this.overlayContext.setLineDash([2, 15])

    window.socket.on('faceDetected', this.handleFaceDetected)
    window.socket.on('userTrainned', this.handleUserTrainned)
    window.socket.on('start-training', () => Router.push('/?training=1'))

    if (this.video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.cameraStream = stream
        this.video.src = window.URL.createObjectURL(this.cameraStream)

        this.video.play().then(() => {
          if (!isTraining) {
            this.startDetecting()
          } else {
            this.trainNewUser()
          }
        })
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.url.query.training && nextProps.url.query.training) {
      this.trainNewUser()
    }
  }

  componentWillUnmount () {
    clearInterval(this.recognizingInterval)
    clearInterval(this.trainingInterval)
    clearTimeout(hideMessageTimeout)

    if (this.video) {
      this.video.pause()
      this.cameraStream.getTracks()[0].stop()
    }
  }

  onDismissMessage = () => {
    this.setState({ savedUserName: null })
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
    const { dispatch, users, currentUser } = this.props
    const { isTraining } = this.state
    const { id, position, ...userData } = data

    this.clearFaceOverlay()

    if (isTraining) {
      return
    }


    if (id) {
      if (currentUser && currentUser.id === id) {
        return
      }

      this.setState({ showAddUserButton: false })

      dispatch(setCurrentUser({ id, ...userData }))

      window.socket.emit('update-settings', userData.settings)
    } else if (position) {
      this.drawFaceOverlay(position)

      this.setState({ showAddUserButton: true })
    }
  }

  startDetecting = () => {
    this.recognizingInterval = setInterval(() => {
      this.videoContext.drawImage(this.video, 0, 0, canvasSize.width, canvasSize.height)

      window.socket.emit('recognizeFace', this.videoCanvas.toDataURL('image/jpeg', 1))
    }, recognizingIntervalTimeout)
  }

  trainNewUser = () => {
    const { users } = this.props

    clearInterval(this.recognizingInterval)
    clearInterval(this.trainingInterval)

    this.setState({
      showAddUserButton: false,
      trainingPhotoIndex: 0,
      isTraining: true,
    })

    const newUserId = lastUserId(users) + 1

    window.socket.emit(`removeUser`, newUserId)

    this.trainingInterval = setInterval(() => {
      this.setState({ trainingPhotoIndex: this.state.trainingPhotoIndex + 1 }, () => {
        if (this.state.trainingPhotoIndex >= trainingPhotosCount) {
          clearInterval(this.trainingInterval)

          window.socket.emit(`trainUser`, newUserId)
        } else {
          this.videoContext.drawImage(this.video, 0, 0, canvasSize.width, canvasSize.height)

          window.socket.emit(
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

    window.socket.emit(`removeUser`, userId)

    this.setState({ isTraining: false, trainingPhotoIndex: 0 })
    this.startDetecting()
  }

  handleUserTrainned = id => {
    Router.push(`/profile?id=${id}&isNew=1`)
  }

  render () {
    const { savedUserName, showAddUserButton, isTraining, trainingPhotoIndex } = this.state

    return (
      <Layout hideHeader={ isTraining } hideFooter={ isTraining }>
        {savedUserName
          ? <Message
            onDismiss={this.onDismissMessage}
            header={`Perfil "${savedUserName}" salvo com sucesso.`}
            onClick={this.onDismissMessage}
          />
          : ''
        }

        <div>
          <Loader active inverted size="massive" />

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
            className={`overlayCanvas ${isTraining ? 'hidden' : ''}`}
            width={canvasSize.width}
            height={canvasSize.height}
          />

          { isTraining
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
              </div>
            )
            : null
          }
        </div>

        <style jsx>{`
          :global(.ui.message) {
            box-shadow: none;
            left: 20px;
            position: absolute;
            right: 20px;
            top: 20px;
            z-index: 10000;
          }

          div :global(.ui.loader) {
            left: 50%;
            position: absolute;
            top: 50%;
            margin: -.5em 0 0 -.5em;
            z-index: 0;
          }

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
            bottom: 40px;
            transform: translateX(-50%);
            z-index: 3;
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
