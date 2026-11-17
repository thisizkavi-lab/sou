import { breadcrumbItems } from './breadcrumbPaths'
import './breadcrumbs.css'

export default function Breadcrumbs({ route, lessonOnly, ...context }) {
  const items = breadcrumbItems(route, context)
  return <nav className="aw-breadcrumbs" aria-label={context.language === 'ja' ? '現在の位置' : 'Breadcrumb'}>
    <ol>{(lessonOnly ? items.slice(-1) : items).map((item, index) => <li key={index}>
      {index > 0 && <span className="aw-breadcrumb-separator" aria-hidden="true">/</span>}
      {item.href ? <a href={item.href}>{item.label}</a> : <span aria-current="page">{item.label}</span>}
    </li>)}</ol>
  </nav>
}
