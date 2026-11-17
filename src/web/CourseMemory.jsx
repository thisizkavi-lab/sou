import { createContext, useContext, useState } from 'react'
import Glyph from './Glyph'
import { useLanguage } from './Language'
import { textBookmarkId } from './learning'

export const CourseMemory = createContext(null)

function readActivity(learning, key, fallback, valid) {
  try {
    const value = JSON.parse(learning.activities?.[key])
    return valid(value) ? value : fallback
  } catch {
    return fallback
  }
}

export function useActivityValue(key, fallback, valid) {
  const memory = useContext(CourseMemory)
  const [localValue, setLocalValue] = useState(fallback)
  if (!memory) return [localValue, setLocalValue]
  const value = readActivity(memory.learning, key, fallback, valid)
  const set = (next) => memory.update(previous => {
    const current = readActivity(previous, key, fallback, valid)
    const updated = typeof next === 'function' ? next(current) : next
    const serialized = JSON.stringify(updated)
    if (serialized === previous.activities?.[key]) return previous
    return {
      ...previous,
      activities: { ...previous.activities, [key]: serialized },
    }
  })
  return [value, set]
}

export function SaveExpression({ item, en = item?.en, ja = item?.ja, topic }) {
  const memory = useContext(CourseMemory)
  const { language } = useLanguage()
  if (!memory || typeof en !== 'string' || !en.trim()) return null
  const chapter = memory.chapter
  if (!topic && !chapter) return null
  const number = topic ? String(topic).padStart(2, '0') : chapter
  const id = /^ch\d{2}-(?:line|v|b|p)\d+$/.test(item?.id)
    ? item.id
    : textBookmarkId(topic ? 'vocab' : 'study', number, en)
  const saved = memory.savedIds.has(id)
  const label = language === 'ja' ? (saved ? '保存を解除' : '保存する') : (saved ? 'Remove from saved' : 'Save')
  return (
    <button type="button" className="sou-bookmark" aria-pressed={saved}
      title={label} aria-label={label + ' · ' + en}
      onClick={() => memory.save({ id, en, ja, ...(topic ? { topic: number } : { chapter }) })}>
      <Glyph name={saved ? 'check' : 'save'} size={16} />
    </button>
  )
}
