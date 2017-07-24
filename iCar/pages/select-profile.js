import withRedux from 'next-redux-wrapper'
import Link from 'next/link'
import Router from 'next/router'
import { Component } from 'react'
import { Icon, Header, Button, Modal, Grid } from 'semantic-ui-react'

import Layout from '../components/layout'
import { initStore, setCurrentUser, deleteUser } from '../helpers/store'

class SelectProfilePage extends Component {
  state = {
    userToDelete: null,
  }

  selectUser = (id, data) => {
    const { dispatch } = this.props

    window.socket.emit('update-settings', data.settings)

    dispatch(setCurrentUser({ id, ...data }))

    Router.push('/')
  }

  confirmDeleteUser = user => {
    this.setState({ userToDelete: user })
  }

  hideConfirmDeleteModal = () => {
    this.setState({ userToDelete: null })
  }

  performDeleteUser = () => {
    const { userToDelete } = this.state
    const { currentUser, dispatch } = this.props

    if (!userToDelete) {
      return
    }

    window.socket.emit('removeUser', userToDelete.id)

    dispatch(deleteUser(userToDelete.id))

    if (currentUser && userToDelete.id == currentUser.id) {
      dispatch(setCurrentUser(null))
    }

    this.hideConfirmDeleteModal()
  }

  renderConfirmDeleteModal = () => {
    const { userToDelete } = this.state

    if (!this.container || userToDelete === null) {
      return null
    }

    return (
      <Modal open basic size="small" mountNode={this.container}>
        <Header as="h2" icon textAlign="center">
          <Icon name="user delete" />
          <Header.Content>Apagar perfil "{userToDelete.name}"</Header.Content>
        </Header>
        <Header as="h4" textAlign="center">Todas a preferências associadas a esse perfil serão eliminadas.</Header>

        <Grid columns='equal'>
          <Grid.Row>
            <Grid.Column>
              <Button onClick={this.hideConfirmDeleteModal} size="big" fluid>Cancelar</Button>
            </Grid.Column>

            <Grid.Column>
              <Button
                onClick={this.performDeleteUser}
                size="big"
                fluid
                color="red"
                content="Apagar"
                icon="trash"
                labelPosition="right"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal>
    )
  }

  render () {
    const { currentUser, users } = this.props

    if (!users) {
      return <Layout />
    }

    const currentUserId = currentUser ? currentUser.id : false

    if (!this.container) {
      setTimeout(() => this.forceUpdate())
    }

    return (
      <Layout hideHeader hideFooter>
        <div ref={el => this.container = el} className="container">
          <Link href="/">
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
                  onClick={() => this.selectUser(id, user)}
                />

                <Link href={`/profile?id=${id}`}>
                  <a className="ui button icon basic inverted">
                    <Icon name="setting" />
                  </a>
                </Link>

                <Button basic inverted icon onClick={() => this.confirmDeleteUser({ id, ...user })}>
                  <Icon name="trash" />
                </Button>
              </li>
            ))}
          </ul>

          <Link href="/?training=1">
            <a className="ui left labeled teal big icon button">
              <Icon name="user plus" /> Adicionar perfil
            </a>
          </Link>
        </div>

        {this.renderConfirmDeleteModal()}

        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            padding: 30px 125px 60px;
            position: relative;
            height: 100%;
          }

          .container :global(.ui.basic.button.back-button) {
            position: absolute;
            box-shadow: none !important;
            font-size: 16px;
            top: 30px;
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

          :global(.ui.modals.visible) {
            background: rgba(39, 44, 59, .95);
            position: absolute;
          }

          :global(.ui.modals.visible) :global(h2) {
            margin-bottom: 0 !important;
            padding-bottom: 0;
          }
        `}</style>
      </Layout>
    )
  }
}

export default withRedux(initStore, state => state, dispatch => ({ dispatch }))(SelectProfilePage)
