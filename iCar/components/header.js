import { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Header as H } from 'semantic-ui-react'

const getTime = () => {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
  }

  return new Intl.DateTimeFormat('pt-PT', options).format(new Date())
}

class Header extends Component {
  state = {
    time: getTime(),
  }

  componentDidMount() {
    this.interval = setInterval(() => this.setState({ time: getTime() }), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  render() {
    const { currentUser, classes } = this.props
    const { time } = this.state

    return (
      <div>
        <header>
          <div>
            <Icon name="signal" />
            <Icon name="bluetooth alternative" />
            { currentUser
              ? <H as="h4">{currentUser.firstName} {currentUser.lastName}</H>
              : null
            }
          </div>

          <div>
            <Icon name="clock" />
            <H as="h4">{time}</H>
          </div>

          <div>
            <Icon name="thermometer three quarters" />
            <H as="h4">15ºC</H>
          </div>
        </header>

        <style jsx>{`
          header {
            align-items: center;
            background: rgba(34, 39, 53, .6);
            color: #fff;
            display: flex;
            height: 30px;
            justify-content: space-between;
            left: 0;
            padding: 0 10px;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1;
          }

          div {
            align-items: center;
            display: flex;
          }

          header :global(.icon) {
            line-height: 1;
          }

          header :global(.ui.header) {
            color: #fff;
            margin: 0;
          }
        `}</style>
      </div>
    )
  }
}

export default connect(state => state)(Header)
