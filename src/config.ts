import type { Config } from './types'

export const config: Config = {
  settings: {
    title: 'Status Page Pro',
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
      id: 'workers.cloudflare.com',
      url: 'https://workers.cloudflare.com',
      description: 'You write code. They handle the rest.',
      followRedirect: false,
    },
    {
      id: 'requests.forge.dns.navy',
      url: 'https://requests.forge.dns.navy/login',
      name: 'Overseerr',
      followRedirect: true,
    },
    {
      id: 'www.cloudflare.com',
      url: 'https://www.cloudflare.com',
      description: 'Built for anything connected to the Internet.',
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
    'https://docs.google.com/spreadsheets/d/1Fh6_sqeTb1PUzU5LodJV-Ec27te28QPLtFyhUBwYJyY/pub?gid=0&single=true&output=csv',
}
