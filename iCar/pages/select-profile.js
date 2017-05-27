import withRedux from 'next-redux-wrapper'
import Link from 'next/link'
import Router from 'next/router'
import { Component } from 'react'
import { Icon, Header, Button } from 'semantic-ui-react'

import Layout from '../components/layout'
import { initStore, setCurrentUser } from '../helpers/store'

class SelectProfilePage extends Component {
  // ToDo: remove this
  componentDidUpdate() {
    const { currentUser, users, dispatch } = this.props
    const userIds = Object.keys(users || {})

    if (!currentUser && userIds.length) {
      const firstUser = users[userIds[0]]

      dispatch(setCurrentUser({ id: userIds[0], ...firstUser }))
    }
  }

  setCurrentUser = (id, data) => {
    const { dispatch } = this.props

    dispatch(setCurrentUser({ id, ...data }))

    Router.push('/dashboard')
  }

  render () {
    const { currentUser, users } = this.props

    if (!users) {
      return <Layout />
    }

    const currentUserId = currentUser ? currentUser.id : false

    return (
      <Layout>
        <div className="container">
          <Link href="/dashboard">
            <a className="ui button icon basic inverted back-button">
              <Icon name="left arrow" /> Voltar
            </a>
          </Link>

          <Header as="h1" textAlign="center">Perfis</Header>

          <ul>
            {Object.entries(users).map(([id, user]) => (
              <li key={`profile-${id}`} className={id == currentUserId ? 'active' : ''}>
                <Button
                  basic
                  inverted
                  content={user.name}
                  icon="checkmark"
                  labelPosition="left"
                  onClick={() => this.setCurrentUser(id, user)}
                />

                <Link href={`/profile?id=${id}`}>
                  <a className="ui button icon basic inverted">
                    <Icon name="setting" />
                  </a>
                </Link>

                <Button basic inverted icon><Icon name="trash" /></Button>
              </li>
            ))}
          </ul>

          <Link href="/?training=1">
            <a className="ui left labeled teal big icon button">
              <Icon name="user plus" /> Adicionar perfil
            </a>
          </Link>
        </div>
        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            padding: 60px 125px;
            position: relative;
            height: 100%;
          }

          .container :global(.ui.basic.button.back-button) {
            position: absolute;
            box-shadow: none !important;
            font-size: 16px;
            top: 60px;
            left: 15px;
          }

          .container :global(.ui.basic.button.back-button) :global(.icon) {
            margin-right: 10px !important;
            font-size: 15px;
          }

          .container :global(.ui.header) {
            color: white;
            margin: 0 0 45px 0;
          }

          ul {
            list-style: none;
            margin: 0 0 10px 0;
            padding: 0;
            overflow: auto;
          }

          li {
            align-items: center;
            display: flex;

            & + li {
              margin-top: 10px;
            }

            & > :global(.ui.inverted.button) {
              background: #272c3b !important;
              border-radius: 0;
              box-shadow: none !important;
              color: rgba(255, 255, 255, .6);
              align-items: center;
              display: flex;
              justify-content: center;
              height: 52px;
              width: 52px;
              margin: 0;
            }

            & > :global(.ui.button+.ui.button) {
              margin-left: 2px;
            }

            & > :global(.ui.button:first-child) {
              border-radius: 4px 0 0 4px;
              flex: 1;
              justify-content: flex-start;
              padding: 0 20px;
            }

            & > :global(.ui.button:last-child) {
              border-radius: 0 4px 4px 0;
            }

            & :global(.icon) {
              font-size: 20px;
              line-height: 1;
            }
          }

          li:not(.active) :global(.ui.header) {
            color: rgba(255, 255, 255, .6);
          }

          li:not(.active) :global(.ui.button:first-child) :global(.icon) {
            color: rgba(255, 255, 255, .1);
          }

          li.active :global(.ui.button:first-child) :global(.icon) {
            color: #00b8ad;
          }

          .container > :global(.ui.button:last-child) {
            margin-top: auto;
          }
        `}</style>
      </Layout>
    )
  }
}

export default withRedux(initStore, state => state, dispatch => ({ dispatch }))(SelectProfilePage)
