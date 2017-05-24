import { Component } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import fetch from 'isomorphic-fetch'

import Header from '../components/header'
import { setUsers } from '../helpers/store'

class Layout extends Component {
  componentWillMount() {
    const { dispatch, users } = this.props

    if (!users) {
      fetch('http://localhost:3000/users')
        .then(res => res.json())
        .then(users => dispatch(setUsers(users)))
    }
  }

  render () {
    return (
      <main>
        <div className="container">
          {this.props.children}

          <Header />
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
