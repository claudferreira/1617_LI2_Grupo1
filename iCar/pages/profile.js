import io from 'socket.io-client'
import withRedux from 'next-redux-wrapper'
import Link from 'next/link'
import Router from 'next/router'
import { Component } from 'react'
import { Header, Checkbox, Button, Form } from 'semantic-ui-react'

import Layout from '../components/layout'
import { initStore, setUsers, setCurrentUser } from '../helpers/store'

const allowedValues = ['0', '50', '100']

const emptyUser = {
  name: '',
  settings: {
    seat: { enabled: false, value: allowedValues[0] },
    mirrors: { enabled: false, value: allowedValues[0] },
    drivingWheel: { enabled: false, value: allowedValues[0] },
  }
}

const sectionTitles = {
  seat: 'Posição do banco',
  mirrors: 'Posição dos espelhos',
  drivingWheel: 'Posição do volante',
}

class ProfilePage extends Component {
  constructor(props) {
    super(props)

    const { users, url: { query: { id } } }  = props
    const user = (users && users[id]) ? users[id] : emptyUser

    this.state = { id, user, initialValues: user }
  }

  updateUserName = e => {
    this.setState({ user: { ...this.state.user, name: e.target.value } })
  }

  updateSection = (sectionKey, value, key = 'value') => {
    const { user } = this.state

    this.setState({
      user: {
        ...user,
        settings: {
          ...user.settings,
          [sectionKey]: {
            ...user.settings[sectionKey],
            [key]: value,
          },
        },
      },
    })
  }

  save = e => {
    if (e) {
      e.preventDefault()
    }

    const { users, currentUser, dispatch } = this.props
    const { id, user } = this.state

    if (!user.name) {
      return
    }

    const socket = io(window.location.origin)

    socket.on('connect', () => {
      socket.emit('saveUserSettings', id, user)

      dispatch(setUsers({ ...users, [id]: user }))

      if (!currentUser) {
        dispatch(setCurrentUser({ id, ...user }))
      }

      Router.push(`/dashboard?saved=${user.name}`)
    })
  }

  render () {
    const { user, initialValues } = this.state

    return (
      <Layout>
        <div className="container">
          <Header as="h1" textAlign="center">
            {initialValues.name
              ? `Editar '${initialValues.name}'`
              : 'Adicionar Perfil'
            }
          </Header>

          <Form onSubmit={this.save}>
            <Form.Input
              label="Nome"
              value={user.name}
              onChange={this.updateUserName}
              size="big"
              autoFocus
            />

            {Object.entries(user.settings).map(([key, section]) => (
              <Form.Field key={`section-${key}`}>
                <Checkbox
                  toggle
                  label={sectionTitles[key]}
                  checked={section.enabled}
                  onChange={(e, { checked }) => this.updateSection(key, checked, 'enabled')}
                />

                <Button.Group inverted basic>
                  {allowedValues.map(value => (
                    <Button
                      key={`value-${value}`}
                      type="button"
                      disabled={!section.enabled}
                      active={section.value === value}
                      onClick={() => this.updateSection(key, value)}
                    >
                      {value}
                    </Button>
                  ))}
                </Button.Group>
              </Form.Field>
            ))}

            <Button.Group fluid size="big">
              <Button
                type="button"
                color="teal"
                disabled={!user.name}
                onClick={this.save}
              >
                Salvar
              </Button>

              <Link href="/dashboard"><a className="ui button">Cancelar</a></Link>
            </Button.Group>
          </Form>
        </div>

        <style jsx>{`
          .container {
            padding: 60px 125px;
          }

          .container :global(.ui.header) {
            color: white;
          }

          .container :global(.field) {
            margin: 30px 0 0 0;
          }

          .container :global(.field:first-child) :global(input) {
            background: none;
            color: white;
            border-color: white;
          }

          .container :global(.field:not(:first-child)) {
            align-items: center;
            display: flex;
            justify-content: space-between;
          }

          .container :global(label),
          .container :global(.ui.toggle.checkbox) :global(input~label) {
            color: white !important;
          }

          .container :global(.ui.toggle.checkbox) :global(label:before) {
            background-color: transparent !important;
            border: 1px solid white;
          }

          .container :global(.ui.toggle.checkbox) :global(:checked~label:before) {
            background-color: #00b5ad !important;
            border-color: #00b5ad;
          }

          .container :global(.field) :global(.ui.buttons) :global(.button) {
            box-shadow: inset 0 0 0 1px white !important;
            border: 0;
            margin: 0 0 0 -1px;
          }

          .container :global(.field) :global(.ui.buttons) :global(.button.active) {
            background-color: white !important;
            color: black !important;
          }

          .container :global(.fluid) {
            margin: 45px 0 0 0;
          }

          .container :global(.fluid) :global(*) {
            border-radius: 4px;
          }

          .container :global(.fluid) :global(a) {
            margin-left: 15px;
          }
        `}</style>
      </Layout>
    )
  }
}

export default withRedux(initStore, state => state, dispatch => ({ dispatch }))(ProfilePage)
