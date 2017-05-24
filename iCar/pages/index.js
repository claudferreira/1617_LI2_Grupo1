import io from 'socket.io-client'
import Router from 'next/router'
import withRedux from 'next-redux-wrapper'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'

import Layout from '../components/layout'
import { initStore, setCurrentUser } from '../helpers/store'

const canvasSize = { width: 800, height: 600 }
const recognizingIntervalTimeout = 750

class HomePage extends Component {
  state = {
    showAddUserButton: false,
  }

  componentDidMount () {
    this.videoContext = this.videoCanvas.getContext('2d')

    this.overlayContext = this.overlayCanvas.getContext('2d')
    this.overlayContext.strokeStyle = 'rgb(0, 184, 174)'
    this.overlayContext.lineWidth = 4
    this.overlayContext.lineCap = 'round'
    this.overlayContext.setLineDash([2, 15])

    this.socket = io('http://localhost:3000/')
    this.socket.on('faceDetected', this.handleFaceDetected)

    if (this.video && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        this.cameraStream = stream
        this.video.src = window.URL.createObjectURL(this.cameraStream)

        this.video.play()

        this.recognizingInterval = setInterval(() => {
          this.videoContext.drawImage(this.video, 0, 0, canvasSize.width, canvasSize.height)

          this.socket.emit(`recognizeFace`, this.videoCanvas.toDataURL('image/jpeg', 1))
        }, recognizingIntervalTimeout)
      })
    }
  }

  componentWillUnmount () {
    clearInterval(this.recognizingInterval)

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

  createNewUser = () => {
    this.setState({
      showAddUserButton: false,
      isLearningNewUser: true,
    })
  }

  goToDashboard = () => {
    Router.push('/dashboard')
  }

  render () {
    const { showAddUserButton } = this.state

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
            className="overlayCanvas"
            width={canvasSize.width}
            height={canvasSize.height}
          />

          { showAddUserButton
            ? (
              <div className="buttons">
                <Button
                  content="Adicionar Perfil"
                  icon="add user"
                  labelPosition="left"
                  color="teal"
                  size="big"
                  onClick={this.createNewUser}
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

          .buttons {
            left: 50%;
            position: absolute;
            bottom: 20px;
            transform: translateX(-50%);
          }

          div :global(.spinner.icon) {
            left: 50%;
            position: absolute;
            top: 50%;
            margin: -.5em 0 0 -.5em;
          }
        `}</style>
      </Layout>
    )
  }
}

export default withRedux(initStore, state => state)(HomePage)
