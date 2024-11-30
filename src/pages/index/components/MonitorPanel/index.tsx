import React from 'react'

import Empty from './Empty'

import type { DataV1, MonitorAllData } from '#src/worker/_helpers/store'
import type { Monitor } from '#src/types'

import { getDisplayDays, getHistoryDates } from '#src/worker/_helpers/datetime'
import { parseLocation } from '#src/helpers/locations'
import { Tooltip, TooltipContent, TooltipTrigger } from '#src/components/Tooltip'
import { getChecksItemRenderStatus, getTargetDateChecksItem } from '#src/helpers/checks'

export interface IMonitorPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  allMonitors: Monitor[]
  data?: DataV1 | null
  search?: string
}

const MonitorPanel: React.FC<IMonitorPanelProps> = (props) => {
  const { allMonitors, data, search, ...restDivProps } = props

  if (allMonitors.length === 0) {
    return (
      <Empty>
        No monitors
      </Empty>
    )
  }

  if (!data || !data.monitorHistoryData || Object.keys(data).length === 0) {
    return (
      <Empty>
        <span className='i-svg-spinners--ring-resize mr-1 size-5' />
        No Data (
        {allMonitors.length}
        {' '}
        monitor(s))
      </Empty>
    )
  }

  const monitorIds = (Object.keys(data.monitorHistoryData) || [])
  const allOperational = data.lastUpdate?.checks.allOperational

  const titlePingColor = allOperational ? 'bg-green-400' : 'bg-red-400'
  const titleStatusColor = allOperational ? 'bg-green-500' : 'bg-red-500'
  const titleCls = allOperational ? 'border-green-500 bg-green-300 text-green-800 dark:border-green-600 dark:bg-green-800 dark:text-green-300' : 'border-red-500 bg-red-300 text-red-800 dark:border-red-600 dark:bg-red-800 dark:text-red-300'
  return (
    <div {...restDivProps}>
      <div
        className={`
          flex flex-col items-center justify-center rounded border px-4 py-2 text-lg font-bold shadow-md transition-all md:flex-row md:items-center md:justify-between
                    ${titleCls}
        `}
        onDoubleClick={() => {
          // eslint-disable-next-line no-console
          console.log('allMonitors', allMonitors)
          // eslint-disable-next-line no-console
          console.log('data', data)
        }}
      >
        <span className='ml-2 flex items-center gap-2 font-medium'>
          {allOperational ? 'All Systems Operational' : 'System Disruption Detected'}
          <span className='relative flex size-2.5 md:pt-px'>
            <span className={`absolute inline-flex size-full rounded-full motion-safe:animate-ping motion-safe:[animation-duration:1.2s] ${titlePingColor} opacity-75`} />
            <span className={`relative inline-flex size-2.5 rounded-full ${titleStatusColor}`} />
          </span>
        </span>
        {!!data.lastUpdate && (
          <div className='text-xs font-light' suppressHydrationWarning title={new Date(data.lastUpdate.time).toLocaleString()}>
            checked
            {' '}
            {Math.round((Date.now() - data.lastUpdate.time) / 1000)}
            {' '}
            sec
            ago (from
            {' '}
            {parseLocation(data.lastUpdate.location)}
            )
          </div>
        )}
      </div>
      <ul className='mt-6 flex flex-col gap-y-2 md:mt-4'>
        {monitorIds.filter((item) => {
          const targetMonitor = allMonitors.find((monitorItem) => monitorItem.id === item)
          const title = targetMonitor?.name || item
          const keyword = search?.trim().toLowerCase()
          if (!keyword) {
            return true
          }

          const searchFields = [title, targetMonitor?.id, targetMonitor?.description]

          return searchFields.filter(Boolean).some((item) => item!.toLowerCase().includes(keyword.toLowerCase()))
        }).map((item) => {
          // New monitor id maybe no monitor data
          const monitorData = data.monitorHistoryData![item] as MonitorAllData | undefined
          const monitorConfig = allMonitors.find((monitorItem) => monitorItem.id === item)
          const targetMonitor = allMonitors.find((monitorItem) => monitorItem.id === item)
          const title = targetMonitor?.name || item

          const firstCheckInfo = monitorData
            ? [{
                key: 'First Check',
                value: monitorData.firstCheck,
              }]
            : []
          const lastCheckInfo = monitorData
            ? [{
                key: 'Last Check Time',
                value: monitorData.lastCheck.time ? new Date(monitorData.lastCheck.time).toLocaleString() : null,
              }, {
                key: 'Last Check Operational',
                value: monitorData.lastCheck.operational.toString(),
              }, {
                key: 'Last Check Status',
                value: `${monitorData.lastCheck.status} / ${monitorData.lastCheck.statusText}`,
              }]
            : []

          const info = [
            ...(monitorConfig
              ? [
                  { key: 'Description', value: monitorConfig?.description },
                  {
                    key: 'Method',
                    value: (monitorConfig.method || 'GET').toUpperCase(),
                  },
                  {
                    key: 'URL',
                    value: monitorConfig.url,
                  },
                  {
                    key: 'Expect Status',
                    value: monitorConfig.expectStatus || 200,
                  },
                  {
                    key: 'Follow Redirect',
                    value: (monitorConfig.followRedirect || false).toString(),
                  },
                ]
              : []),
            ...firstCheckInfo,
            ...lastCheckInfo,
          ].filter((item) => !(typeof item.value === 'undefined' || item.value === null)) as {
            key: string
            value: string | number
          }[]

          return (
            <li key={item} className='[&:not(:last-child)]:mb-2'>
              <div className='mb-1 flex items-center justify-between gap-2 md:justify-start'>
                <h2 className='text-3xl font-light text-slate-950 md:text-2xl lg:text-lg dark:text-slate-50'>
                  {title}
                </h2>
                <div className='flex items-center gap-2'>
                  {!!info.length && (
                    <Tooltip>
                      <TooltipTrigger className='size-5 text-slate-500'>
                        <span className='i-ic--outline-info size-full' />
                      </TooltipTrigger>
                      <TooltipContent
                        as='ul'
                        className='list-none whitespace-pre rounded p-2
                          shadow-lg backdrop-blur-lg'
                      >
                        {info.map((item) => {
                          return (
                            <li key={item.key}>
                              <span className="text-lg font-medium after:content-[':_'] md:text-base">
                                {item.key}
                              </span>
                              <span className='text-balance text-base md:text-sm'>
                                {item.value}
                              </span>
                            </li>
                          )
                        })}
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {monitorConfig
                  && (!monitorConfig.method || monitorConfig.method.toUpperCase() === 'GET')
                  && (
                    <a
                      className='i-ic--outline-open-in-new size-5 text-slate-500 hover:text-slate-400'
                      href={monitorConfig.url}
                      target='_blank'
                      rel='noreferrer'
                      title='Open in new tab'
                    >
                      <span className='sr-only'>{title}</span>
                    </a>
                  )}
                </div>
              </div>
              <ul className='flex gap-1'>
                {getHistoryDates().map((dateItem) => {
                  const targetDateChecksItem = monitorData ? getTargetDateChecksItem(monitorData, dateItem) : undefined
                  const renderStatus = monitorData ? getChecksItemRenderStatus(monitorData, dateItem) : undefined

                  let color = 'bg-gray-300 dark:bg-gray-600'
                  let textColor = 'text-gray-300 dark:text-gray-600'
                  let insetColor = 'text-gray-600 dark:text-gray-400'
                  let statusStr: React.ReactNode = null

                  switch (renderStatus) {
                    case 'all-good':
                      color = 'bg-green-500 dark:bg-green-600'
                      textColor = 'text-green-500 dark:text-green-600'
                      insetColor = 'text-green-600 dark:text-green-500'
                      statusStr = 'All good'
                      break
                    case 'all-incidents':
                      color = 'bg-red-700 dark:bg-red-800'
                      textColor = 'text-red-700 dark:text-red-800'
                      insetColor = 'text-red-800 dark:text-red-700'
                      statusStr = `${targetDateChecksItem!.fails} incident(s)`
                      break
                    case 'latest-incident':
                      color = 'bg-red-500 dark:bg-red-600'
                      textColor = 'text-red-500 dark:text-red-600'
                      insetColor = 'text-red-600 dark:text-red-500'
                      statusStr = `${targetDateChecksItem!.fails} incident(s)`
                      break
                    case 'has-incident':
                      color = 'bg-yellow-500 dark:bg-yellow-600'
                      textColor = 'text-yellow-500 dark:text-yellow-600'
                      insetColor = 'text-yellow-600 dark:text-yellow-500'
                      statusStr = `${targetDateChecksItem!.fails} incident(s)`
                      break
                    default:
                      break
                  }

                  const itemWidth = `calc(100% / ${getDisplayDays()})`

                  return (
                    <Tooltip key={dateItem}>
                      <TooltipTrigger
                        as='li'
                        className='relative h-full will-change-transform hover:scale-125 motion-safe:transition-transform'
                        style={{
                          width: itemWidth,
                        }}
                      >
                        <span
                          className={`
                            rounded-sm transition-all hover:opacity-70
                            ${color} ${insetColor} block
                            h-10 before:absolute
                            before:inset-0
                            before:rounded-sm before:border-[0.8px]
                            before:border-current
                            before:content-['_'] md:h-8 lg:h-7
                          `}
                        />
                      </TooltipTrigger>
                      <TooltipContent className={`
                        whitespace-pre rounded p-2 text-center text-sm
                                                shadow-lg backdrop-blur-lg
                      `}
                      >
                        <div className='font-semibold'>{dateItem}</div>
                        {statusStr && <div className={`${textColor} font-semibold`}>{statusStr}</div>}
                        <div />
                        {targetDateChecksItem
                          ? Object.keys(targetDateChecksItem.stats).map((item) => {
                            const stat = targetDateChecksItem.stats[item]
                            return (
                              <div key={item}>
                                <span className={`after:content-[':_']`}>
                                  {parseLocation(item)}
                                </span>
                                <span>
                                  <span className='font-semibold'>
                                    {(stat.totalMs / stat.count).toFixed(0)}
                                  </span>
                                  ms
                                </span>
                              </div>
                            )
                          })
                          : (
                              <div>No Data</div>
                            )}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </ul>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default MonitorPanel
