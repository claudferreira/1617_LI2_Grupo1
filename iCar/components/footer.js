import withRedux from 'next-redux-wrapper'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'

import { initStore, setConnectionStatus } from '../helpers/store'

class Footer extends Component {
  componentDidMount() {
    const { dispatch } = this.props

    window.socket.on('connection-status', (data) => {
      dispatch(setConnectionStatus(data.type, data.status))
    })
  }

  render() {
    const { connection = {} } = this.props;

    return (
      <div>
        <footer>
          <span><Icon name="circle" size="small" color={ connection.master ? 'green' : 'red' } /> Master</span>
          <span><Icon name="circle" size="small" color={ connection.slave ? 'green' : 'red' } /> Slave</span>
        </footer>

        <style jsx>{`
          footer {
            align-items: center;
            background: rgba(0, 0, 0, .6);
            color: #fff;
            display: flex;
            height: 30px;
            left: 0;
            padding: 0 10px;
            position: absolute;
            right: 0;
            bottom: 0;
            z-index: 1;
          }

          span + span {
            margin-left: 10px;
          }
        `}</style>
      </div>
    )
  }
}

export default withRedux(initStore, state => state, dispatch => ({ dispatch }))(Footer)
