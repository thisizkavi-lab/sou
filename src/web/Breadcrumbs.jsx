import { breadcrumbItems } from './breadcrumbPaths'
import './breadcrumbs.css'

export default function Breadcrumbs({ route, lessonOnly, ...context }) {
  const social = { label: context.t?.('Social Fluency') ?? 'Social Fluency', href: '#/courses?social' }
  const trail = route.path === '/courses?social' ? [{ label: social.label }] : breadcrumbItems(route, context)
  const items = lessonOnly ? trail.slice(-1) : trail
  if (lessonOnly && ['lesson', 'vocabulary'].includes(route.page)) items.unshift(social)
  return <nav className="aw-breadcrumbs" aria-label={context.language === 'ja' ? '現在の位置' : 'Breadcrumb'}>
    <ol>{items.map((item, index) => <li key={index}>
      {index > 0 && <span className="aw-breadcrumb-separator" aria-hidden="true">/</span>}
      {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
    </li>)}</ol>
  </nav>
}
