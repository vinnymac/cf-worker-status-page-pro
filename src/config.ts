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
  monitorsGvizUrl:
    'https://docs.google.com/spreadsheets/d/1Fh6_sqeTb1PUzU5LodJV-Ec27te28QPLtFyhUBwYJyY/gviz/tq?tqx=out:json&tq&gid=0',
}
