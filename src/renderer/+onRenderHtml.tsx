// https://vike.dev/onRenderHtml
import React from 'react'
import { renderToStream } from 'react-streaming/server'
import { escapeInject } from 'vike/server'

import { PageLayout } from './PageLayout'
import './_global.css'

import type { OnRenderHtmlAsync } from 'vike/types'

import { config } from '#src/config'

export const onRenderHtml: OnRenderHtmlAsync = async (pageContext) => {
  const { Page, pageProps } = pageContext

  const page = (
    <React.StrictMode>
      <PageLayout pageContext={pageContext}>
        <Page {...pageProps} />
      </PageLayout>
    </React.StrictMode>
  )

  // Streaming is optional and we can use renderToString() instead
  const stream = await renderToStream(page, { userAgent: pageContext.userAgent })

  return escapeInject`
    <!DOCTYPE html>
    <html>
      <title>${config.settings.title}</title>
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css">
        <script type="text/javascript">document.documentElement.classList.add(window.matchMedia('(prefers-color-scheme: light)').matches ? '' : 'dark')</script>
        <meta name="viewport" content="width=device-width">
      </head>
      <body>
        <div id="page-view">${stream}</div>
      </body>
    </html>
  `
}
