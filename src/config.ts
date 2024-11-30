import type { Config } from './types'

export const config: Config = {
  settings: {
    title: 'Status',
    url: 'https://status.vinnymac.workers.dev',
    displayDays: 90,
    collectResponseTimes: true,
  },
  monitors: [
    {
      id: 'vincenttaverna.com/',
      url: 'https://vincenttaverna.com/',
      name: 'Blog',
    },
    {
      id: 'requests.forge.dns.navy',
      url: 'https://requests.forge.dns.navy/login',
      name: 'Plex Requests',
      followRedirect: true,
    },
    {
      id: 'www.cloudflare.com',
      url: 'https://www.cloudflare.com',
      name: 'Cloudflare',
      description: 'Built for anything connected to the Internet.',
    },
    {
      id: 'workers.cloudflare.com',
      url: 'https://workers.cloudflare.com',
      name: 'Cloudflare Workers',
      description: 'You write code. They handle the rest.',
      followRedirect: false,
    },
    {
      id: 'google',
      url: 'https://www.google.com/',
      name: 'Google',
      followRedirect: true,
    },
    {
      id: 'GitHub',
      url: 'https://github.com/',
    },
  ],
  monitorsCsvUrl:
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vQxISsGtFRS2exZBpnz3DvemxUwFJQcne9_MviCzrqZJJS1TKWpYbVtGZoA33yAtRUXsxpd24qdwiVD/pub?gid=0&single=true&output=csv',
}
