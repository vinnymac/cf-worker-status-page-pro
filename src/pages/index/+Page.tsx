import { cls } from 'tagged-classnames-free'

import MonitorPanel from './components/MonitorPanel'

import type { IndexPageData } from './+data'

import { usePageContext } from '#src/renderer/usePageContext'
import { config } from '#src/config'
import { useMounted } from '#src/hooks/mounted'

export default function Page() {
  const { data: { allMonitors, kvData, filter } } = usePageContext<IndexPageData>()
  const inputRef = useRef<HTMLInputElement>(null)
  const [inputFocused, setInputFocused] = useState(false)
  const [searchValue, setSearchValue] = useState(filter || '')
  const deferredSearch = useDeferredValue(searchValue)
  const { mounted } = useMounted()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === '/' && !inputFocused) {
        event.stopPropagation()
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keyup', handler)

    return () => {
      window.removeEventListener('keyup', handler)
    }
  }, [inputFocused])

  useEffect(() => {
    const url = new URL(window.location.href)
    if (deferredSearch.trim()) {
      url.searchParams.set('filter', deferredSearch)
      history.replaceState(null, '', url)
    } else {
      url.searchParams.delete('filter')
      history.replaceState(null, '', url)
    }
  }, [deferredSearch])

  if (config.settings.csr === true && !mounted) {
    return null
  }

  return (
    <div className='container max-w-screen-xl pt-4'>
      <header className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img src='/logo.svg' className='size-10' />
          <h1 className='text-3xl [text-shadow:#a8f3ff_1px_0_10px]'>{config.settings.title}</h1>
        </div>
        <div className='flex justify-center'>
          <button
            type='button'
            title='Toggle Theme'
            className='px-4 text-2xl text-slate-950 transition-all will-change-transform [text-shadow:#FC0_1px_0_10px] active:[transform:scale(0.8,0.8)] dark:text-lime-50'
            onClick={() => {
              document.documentElement.classList.toggle('dark')
            }}
          >
            ☀︎
          </button>
          <input
            ref={inputRef}
            value={searchValue}
            onChange={((event) => {
              setSearchValue(event.target.value)
            })}
            onKeyUp={(event) => {
              if (event.key.toLowerCase() === 'escape') {
                event.stopPropagation()
                event.preventDefault()
                setSearchValue('')
                inputRef.current?.blur()
              }
            }}
            onFocus={() => {
              setInputFocused(true)
            }}
            onBlur={() => {
              setInputFocused(false)
            }}
            className={cls`
              h-10 rounded-full border bg-slate-50 px-4 text-slate-900
              shadow outline-none transition-all focus:border-cyan-400 dark:bg-slate-300
              dark:placeholder:text-slate-500 focus:dark:border-cyan-500
            `}
            placeholder='Type "/" to search'
          />
        </div>
      </header>
      <main>
        <MonitorPanel
          allMonitors={allMonitors}
          data={kvData}
          className={cls`mt-4`}
          search={deferredSearch}
        />
      </main>
      <footer className='my-4 flex justify-between'>
        <span>
          Powered by your grandmothers
          {' '}
          <span className='[text-shadow:#ff6347_1px_0_10px]'>
            tomato sauce
          </span>
        </span>
      </footer>
    </div>
  )
}
