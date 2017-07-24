import io from 'socket.io-client'

import { Component } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import fetch from 'isomorphic-fetch'

import Header from '../components/header'
import Footer from '../components/footer'
import { setUsers } from '../helpers/store'

class Layout extends Component {
  componentWillMount() {
    if (typeof window !== 'undefined' && !window.socket) {
      window.socket = io(window.location.origin)
    }

    const { dispatch, users } = this.props

    if (!users && typeof window !== 'undefined') {
      fetch(`${window.location.origin}/users`)
        .then(res => res.json())
        .then(users => dispatch(setUsers(users)))
    }
  }

  render () {
    return (
      <main>
        <div className="container">
          {this.props.children}

          { !this.props.hideHeader && <Header /> }
          { !this.props.hideFooter && <Footer /> }
        </div>

        <style jsx>{`
          .container {
            background: #2e3445;
            height: 600px;
            position: relative;
            width: 800px;
          }
        `}</style>
      </main>
    )
  }
}

export default connect(state => state, dispatch => ({ dispatch }))(Layout)
