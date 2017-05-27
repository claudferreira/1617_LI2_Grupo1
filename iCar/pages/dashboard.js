import withRedux from 'next-redux-wrapper'
import Link from 'next/link'
import { Component } from 'react'
import { Header, Icon } from 'semantic-ui-react'

import Layout from '../components/layout'
import { initStore } from '../helpers/store'

class DashboardPage extends Component {
  render () {
    return (
      <Layout>
        <ul>
          <li>
            <Header as="h3" icon textAlign="center">
              <Icon name="phone" color="orange" inverted circular />
              <Header.Content>Telefone</Header.Content>
            </Header>
          </li>
          <li>
            <Header as="h3" icon textAlign="center">
              <Icon name="music" color="orange" inverted circular />
              <Header.Content>Música</Header.Content>
            </Header>
          </li>
          <li>
            <Header as="h3" icon textAlign="center">
              <Icon name="location arrow" color="orange" inverted circular />
              <Header.Content>Navegação</Header.Content>
            </Header>
          </li>
          <li>
            <Header as="h3" icon textAlign="center">
              <Icon name="thermometer half" color="orange" inverted circular />
              <Header.Content>Climatização</Header.Content>
            </Header>
          </li>
          <li>
            <Header as="h3" icon textAlign="center">
              <Icon name="sliders" color="orange" inverted circular />
              <Header.Content>Configurações</Header.Content>
            </Header>
          </li>
          <li>
            <Link href="/select-profile">
              <a>
                <Header as="h3" icon textAlign="center">
                  <Icon name="user" color="orange" inverted circular />
                  <Header.Content>Perfis</Header.Content>
                </Header>
              </a>
            </Link>
          </li>
        </ul>

        <style jsx>{`
          ul {
            align-items: center;
            display: flex;
            list-style: none;
            margin: 0;
            padding: 60px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            top: 30px;
            flex-wrap: wrap;
          }

          li {
            flex: 1 1 33.3%;
          }

          ul li :global(.circular.icon) {
            color: rgba(255, 255, 255, .6) !important;
            font-size: 2.2em !important;
            margin-bottom: 15px;
          }

          li :global(.content) {
            color: #fff;
            font-size: 24px;
            opacity: .6;
          }

          li:first-child :global(.circular.icon) {
            background-color: #b0cc00 !important;
          }

          li:nth-child(2) :global(.circular.icon) {
            background-color: #00bc37 !important;
          }

          li:nth-child(3) :global(.circular.icon) {
            background-color: #0088d3 !important;
          }

          li:nth-child(4) :global(.circular.icon) {
            background-color: #ff6800 !important;
          }

          li:nth-child(5) :global(.circular.icon) {
            background-color: #f22499 !important;
          }

          li:nth-child(6) :global(.circular.icon) {
            background-color: #b02ccc !important;
          }

        `}</style>
      </Layout>
    )
  }
}

export default withRedux(initStore, state => state)(DashboardPage)
