import Breadcrumbs from './Breadcrumbs.jsx'
import { LanguageSelector, useLanguage } from './Language'
import { Component, lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Button, Icon } from './components'
import { chapterById, foundationSteps } from './content'
import { loadLearning, parseCourseRoute, STORAGE_KEY, toggleSaved, visit } from './learning'
import './english-shell.css'
import { getLearningStage, learningStages } from './pathway'
import { isStaleAssetFailure, shouldRefreshStaleAssets } from './routeRecovery.js'

const SocialCourse = lazy(() => import('./Library').then(module => ({ default: module.SocialCourse })))
const Saved = lazy(() => import('./Library').then(module => ({ default: module.Saved })))
const Foundation = lazy(() => import('./Foundation'))
const Vocabulary = lazy(() => import('./Vocabulary'))
const ChapterLesson = lazy(() => import('./ChapterLesson'))
const HumorLesson = lazy(() => import('./HumorLesson'))
const GreetingsLesson = lazy(() => import('./GreetingsLesson'))
const IntroductionsLesson = lazy(() => import('./IntroductionsLesson'))
const orientationPath = learningStages[0].start
const destinations = [
  { id: 'orientation', path: orientationPath, label: 'Orientation', icon: 'next' },
  { id: 'foundation', path: learningStages[1].start, label: 'Level Zero', icon: 'audio' },
  { id: 'social', path: learningStages[2].overview, label: 'Social Fluency', icon: 'book' },
  { id: 'saved', path: '/saved', label: 'Saved phrases', icon: 'check' },
]

const readCourseRoute = () => parseCourseRoute(window.location.hash)

function readLearning() {
  try {
    return loadLearning(window.localStorage)
  } catch {
    return loadLearning({ getItem: () => null })
  }
}
function useRoute(beforeChange) {
  const [route, setRoute] = useState(readCourseRoute)
  const currentRoute = useRef(route)
  const beforeChangeRef = useRef(beforeChange)
  beforeChangeRef.current = beforeChange
  useEffect(() => {
    const change = () => {
      const next = readCourseRoute()
      if (next.path === currentRoute.current.path) return
      beforeChangeRef.current(currentRoute.current)
      currentRoute.current = next
      setRoute(next)
    }
    window.addEventListener('hashchange', change)
    window.addEventListener('popstate', change)
    return () => {
      window.removeEventListener('hashchange', change)
      window.removeEventListener('popstate', change)
    }
  }, [])
  return route
}
const RELOAD_MARKER = 'artico.stale-assets-reload-at'
class LearningBoundary extends Component {
  state = { failed: false, staleAssets: false }
  static getDerivedStateFromError(error) {
    return { failed: true, staleAssets: isStaleAssetFailure(error) }
  }
  componentDidCatch(error, info) {
    // Keep the real exception visible for debugging genuine render failures.
    console.error('Lesson error:', error, info?.componentStack ?? '')
    if (!isStaleAssetFailure(error)) return
    try {
      const lastReload = window.sessionStorage.getItem(RELOAD_MARKER)
      if (shouldRefreshStaleAssets(error, lastReload)) {
        window.sessionStorage.setItem(RELOAD_MARKER, String(Date.now()))
        // Reload the new build; preserve the URL/hash and local learning data.
        window.location.reload()
      }
    } catch {
      // Blocked session storage: leave the manual reload action available.
    }
  }
  render() {
    if (this.state.failed)
      return (
        <div className="aw-page aw-empty">
          <h1>{this.state.staleAssets ? this.props.updated : this.props.t('This page could not be loaded.')}</h1>
          {this.state.staleAssets && <p>{this.props.t('Reload to open the newest version. Your saved learning stays on this device.')}</p>}
          <Button onClick={() => window.location.reload()}>{this.props.t(this.state.staleAssets ? 'Reload latest version' : 'Try again')}</Button>
        </div>
      )
    return this.props.children
  }
}

export default function ArticoWeb() {
  const { t, language } = useLanguage()
  const mainRef = useRef(null)
  const pendingScroll = useRef(null)
  const vocabularyPositions = useRef({})
  const route = useRoute((outgoing) => {
    const viewport = mainRef.current
    if (!viewport) return
    if (['lesson', 'foundation'].includes(outgoing.page))
      pendingScroll.current = { path: outgoing.path, top: viewport.scrollTop }
    if (outgoing.page === 'vocabulary')
      vocabularyPositions.current[outgoing.path] = viewport.scrollTop
    // Stop any section-jump animation before replacing the page. Capture the
    // outgoing position before React changes its height or the browser clamps it.
    viewport.scrollTo({ top: viewport.scrollTop, behavior: 'instant' })
  })
  const [learning, update] = useState(readLearning)
  const [toast, setToast] = useState('')
  const contentRef = useRef(null)
  const learningRef = useRef(learning)
  const scrollTimer = useRef(null)
  learningRef.current = learning
  const notify = (message) => setToast(message)
  const save = (item) =>
    update((previous) => {
      const id = typeof item === 'string' ? item : item.id
      const saved = toggleSaved(previous.saved, id)
      const savedDetails = { ...previous.savedDetails }
      if (!saved.includes(id)) delete savedDetails[id]
      else if (typeof item !== 'string')
        savedDetails[id] = { id, en: item.en, ja: item.ja ?? '', chapter: item.chapter }
      return { ...previous, saved, savedDetails }
    })
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(learning))
    } catch {
      // Learning remains available in memory when browser storage is blocked.
    }
  }, [learning])
  useLayoutEffect(() => {
    if (scrollTimer.current) {
      clearTimeout(scrollTimer.current)
      scrollTimer.current = null
    }
    const outgoing = pendingScroll.current
    pendingScroll.current = null
    update((previous) =>
      visit(
        outgoing
          ? {
              ...previous,
              positions: {
                ...previous.positions,
                [outgoing.path]: outgoing.top,
              },
            }
          : previous,
        route.path,
      ),
    )
    const viewport = mainRef.current
    const target = route.page === 'vocabulary'
      ? vocabularyPositions.current[route.path] ?? 0
      : learningRef.current.positions[route.path] ?? 0
    let restoring = true
    const observer = new ResizeObserver(() => {
      if (!restoring) return
      viewport.scrollTop = target
      if (Math.abs(viewport.scrollTop - target) < 1) stopRestoring()
    })
    const stopRestoring = () => {
      restoring = false
      observer.disconnect()
      viewport.removeEventListener('wheel', stopRestoring)
      viewport.removeEventListener('touchstart', stopRestoring)
      viewport.removeEventListener('pointerdown', stopRestoring)
      viewport.removeEventListener('keydown', stopRestoring)
    }
    viewport.scrollTop = target
    if (Math.abs(viewport.scrollTop - target) >= 1) {
      observer.observe(contentRef.current)
      viewport.addEventListener('wheel', stopRestoring, { passive: true })
      viewport.addEventListener('touchstart', stopRestoring, { passive: true })
      viewport.addEventListener('pointerdown', stopRestoring, {
        passive: true,
      })
      viewport.addEventListener('keydown', stopRestoring)
    } else stopRestoring()
    return stopRestoring
  }, [route.path])
  useEffect(() => {
    if (route.page === 'courses') {
      document.title = t('Social Fluency') + ' · English for Sou'
      return
    }
    if (route.page === 'vocabulary') {
      const lesson = route.topic ? (language === 'ja' ? `レッスン${Number(route.topic)} · ` : `Lesson ${Number(route.topic)} · `) : ''
      document.title = `${lesson}${language === 'ja' ? '語彙' : 'Vocabulary'} · English for Sou`
      return
    }
    if (route.page === 'saved') {
      document.title = `${t('Saved phrases')} · English for Sou`
      return
    }
    const chapter = chapterById[route.id]
    const foundation = foundationSteps.find((step) => step.id === route.id)
    document.title = `${(language === 'ja' ? chapter?.ja : chapter?.title) ?? (language === 'ja' ? foundation?.ja : foundation?.en) ?? t('Orientation')} · English for Sou`
  }, [route.path, language, t])
  useEffect(() => () => clearTimeout(scrollTimer.current), [])
  useEffect(() => {
    if (!toast) return
    const timeout = setTimeout(() => setToast(''), 6500)
    return () => clearTimeout(timeout)
  }, [toast])
  const recordScroll = (event) => {
    if (!['lesson', 'foundation'].includes(route.page)) return
    const top = event.currentTarget.scrollTop
    const path = route.path
    pendingScroll.current = { path, top }
    clearTimeout(scrollTimer.current)
    scrollTimer.current = setTimeout(
      () =>
        update((previous) => ({
          ...previous,
          positions: { ...previous.positions, [path]: top },
        })),
      180,
    )
  }
  const activeNav = getLearningStage(route.path)?.id ?? (['courses', 'vocabulary'].includes(route.page) ? 'social' : route.page)
  let screen
  if (route.page === 'courses') screen = <SocialCourse learning={learning} />
  else if (route.page === 'saved') screen = <Saved learning={learning} save={save} />
  else if (route.page === 'vocabulary') screen = <Vocabulary route={route} />
  else if (route.page === 'foundation')
    screen = <Foundation key={route.path} route={route} learning={learning} update={update} />
  else if (route.page === 'lesson') {
    const Lesson =
      route.id === '01'
        ? GreetingsLesson
        : route.id === '02'
          ? IntroductionsLesson
          : route.id === '34'
            ? HumorLesson
            : ChapterLesson
    screen = (
      <Suspense
        fallback={
          <div className="aw-page" role="status"> {t("Loading the chapter…")} </div>
        }
      >
        <Lesson
          key={route.path}
          route={route}
          learning={learning}
          update={update}
          save={save}
          notify={notify}
        />
      </Suspense>
    )
  }
  return (
    <div className="aw-app is-english-pilot" data-language={language}>
      <a
        className="aw-skip"
        href="#aw-content"
        onClick={(event) => {
          event.preventDefault()
          mainRef.current.focus()
        }}
      > {t("Skip to content")} </a>
      <aside className="aw-sidebar">
        <a className="aw-wordmark sou-wordmark" href={`#${orientationPath}`}>English for Sou</a>
        <nav className="aw-destinations" aria-label={t("Main navigation")}>
          {destinations.map((destination) => (
            <a
              key={destination.id}
              href={`#${destination.path}`}
              className={activeNav === destination.id ? 'is-active' : ''}
              aria-current={activeNav === destination.id ? 'page' : undefined}
            >
              <Icon name={destination.icon} />
              <span>{t(destination.label)}</span>
            </a>
          ))}
        </nav>
      </aside>
      <div className="aw-main">
        <header className="aw-topbar">
          <Breadcrumbs lessonOnly route={route} language={language} t={t} stageTitle={getLearningStage(route.path)?.title} foundationTitle={foundationSteps.find(step => step.id === route.id)?.[language === 'ja' ? 'ja' : 'en']} />
          <LanguageSelector />
        </header>
        <main
          ref={mainRef}
          id="aw-content"
          tabIndex={-1}
          className="aw-viewport"
          onScroll={recordScroll}
        >
          <div ref={contentRef}>
            <LearningBoundary key={route.path} t={t} updated={language === 'ja' ? '新しいレッスンが公開されました。' : 'The course was updated while this page was open.'}><Suspense fallback={<div className="aw-page" role="status">{t('Loading your lesson…')}</div>}>{screen}</Suspense></LearningBoundary>
          </div>
        </main>
        <nav className="aw-mobile-nav" aria-label={t("Mobile navigation")}>
          {destinations.map((destination) => (
            <a
              key={destination.id}
              href={`#${destination.path}`}
              className={activeNav === destination.id ? 'is-active' : ''}
              aria-current={activeNav === destination.id ? 'page' : undefined}
            >
              <Icon name={destination.icon} />
              <span>{t(destination.label)}</span>
            </a>
          ))}
        </nav>
      </div>
      {toast && (
        <div className="aw-toast" role="status">
          <span>{toast}</span>
          <button type="button" aria-label={t("Dismiss message")} onClick={() => setToast('')}>
            ×
          </button>
        </div>
      )}
    </div>
  )
}
