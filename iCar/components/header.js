import { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Header as H } from 'semantic-ui-react'
import Link from 'next/link'

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

    if (!currentUser) {
        return null
    }

    return (
      <div>
        <header className="container">
          <div>
            <Icon name="signal" />
            <Icon name="bluetooth alternative" />
            <Icon name="clock" />
            <H as="h4">{time}</H>
          </div>

          <div>
            { currentUser
              ? <H as="h4">{currentUser.name}</H>
              : null
            }
          </div>

          <div>
            <Link href="/select-profile">
              <a className="ui button icon basic inverted profiles-button">
                Perfis <Icon name="right arrow" />
              </a>
            </Link>
          </div>
        </header>

        <style jsx>{`
          header {
            align-items: center;
            background: rgba(34, 39, 53, .6);
            color: rgba(255, 255, 255, .6);
            display: flex;
            height: 30px;
            justify-content: space-between;
            left: 0;
            padding: 0 0 0 10px;
            position: absolute;
            right: 0;
            top: 0;
            z-index: 1000;
          }

          .container :global(.ui.basic.button.profiles-button) {
            box-shadow: none !important;
            font-size: 16px;
          }

          .container :global(.ui.basic.button.profiles-button) :global(.icon) {
            font-size: 15px;
          }

          div {
            align-items: center;
            display: flex;

            & :nth-child(2) {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
            }
          }

          header :global(.icon) {
            line-height: 1;
          }

          header :global(.ui.header) {
            color: rgba(255, 255, 255, .6);
            margin: 0;
          }
        `}</style>
      </div>
    )
  }
}

export default connect(state => state)(Header)
