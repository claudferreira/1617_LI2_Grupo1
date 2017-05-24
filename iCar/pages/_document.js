import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'

export default class extends Document {
  static getInitialProps ({ renderPage, dispatch }) {
    const { html, head } = renderPage()

    return { html, head }
  }

  render () {
    return (
      <html>
        <Head>
          <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.10/semantic.min.css"></link>

          <style>{`
            html, body {
              align-items: center;
              color: #fff;
              display: flex;
              font-family: Lato, Helvetica Neue, sans-serif;
              justify-content: center;
              margin: 0;
              padding: 0;
              flex: 1;
              min-height: 100%;
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
