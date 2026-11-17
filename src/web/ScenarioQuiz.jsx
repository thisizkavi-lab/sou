import { useActivityValue } from './CourseMemory'
import { useLanguage } from './Language'
import Glyph from './Glyph'
import './scenario-quiz.css'

const start = { position: 0, answers: {} }

export default function ScenarioQuiz({ chapterId, questions }) {
  const { language } = useLanguage()
  const ja = language === 'ja'
  const count = questions.length
  const [{ position, answers }, setProgress] = useActivityValue('quiz-' + chapterId + '-' + language, start,
    value => Number.isInteger(value?.position) && value.position >= 0 && value.position <= count &&
      value.answers && typeof value.answers === 'object' && !Array.isArray(value.answers) &&
      Object.entries(value.answers).every(([id, option]) => {
        const question = questions.find(item => item.id === id)
        return question && Number.isInteger(option) && option >= 0 && option < question.options.length
      }))
  if (!count) return null
  const finished = position >= count
  const question = finished ? null : questions[position]
  const selected = question ? answers[question.id] : undefined
  const answered = selected !== undefined
  const correct = Object.keys(answers).filter((id) => {
    const item = questions.find((entry) => entry.id === id)
    return item && answers[id] === item.answer
  }).length
  const restart = () => setProgress(start)
  const next = () => setProgress(current => ({ ...current, position: Math.min(current.position + 1, count) }))

  return (
    <section className="ip-your-turn sq-quiz" aria-labelledby="ip-situations-heading">
      <div className="sq-heading">
        <span className="sq-section-number">02</span>
        <h2 id="ip-situations-heading" tabIndex={-1}>
          {ja ? '理解をチェック' : 'Test yourself'}
        </h2>
      </div>
      {finished ? (
        <div className="sq-panel sq-finished">
          <Glyph name="check" size={28} />
          <h3>{ja ? 'チェック終了' : 'Quiz complete'}</h3>
          <p>{ja ? count + '問中' + correct + '問正解' : correct + ' of ' + count + ' correct'}</p>
          <button type="button" className="ip-primary" onClick={restart}>
            {ja ? 'もう一度挑戦' : 'Try again'}
            <Glyph name="repeat" size={18} />
          </button>
        </div>
      ) : (
        <div className="sq-panel" key={question.id}>
          <div className="sq-progress">
            <span>{ja ? '問題' : 'Question'} {position + 1} / {count}</span>
            <span>{correct} {ja ? '問正解' : 'correct'}</span>
          </div>
          <div className="sq-progress-track" aria-hidden="true">
            <span style={{ width: ((position + (answered ? 1 : 0)) / count) * 100 + '%' }} />
          </div>
          <h3 className="sq-question" id="sq-question">{question.prompt}</h3>
          {question.detail && <p className="sq-detail">{question.detail}</p>}
          <div className="sq-options" role="group" aria-labelledby="sq-question">
            {question.options.map((option, i) => (
              <button
                key={i}
                type="button"
                className={'sq-option' +
                  (answered && i === question.answer ? ' is-correct' : '') +
                  (answered && selected === i && i !== question.answer ? ' is-incorrect' : '')}
                aria-pressed={selected === i}
                disabled={answered}
                onClick={() => setProgress(current => current.answers[question.id] !== undefined
                  ? current : { ...current, answers: { ...current.answers, [question.id]: i } })}
              >
                <span className="sq-option-letter" aria-hidden="true">{'ABC'[i]}</span>
                <span lang="en">{option}</span>
                {answered && i === question.answer && <Glyph name="check" size={18} />}
                {answered && selected === i && i !== question.answer && <Glyph name="x" size={18} />}
              </button>
            ))}
          </div>
          {answered && (
            <div className={'sq-feedback ' + (selected === question.answer ? 'is-correct' : 'is-incorrect')} role="status" aria-live="polite">
              <strong>{selected === question.answer ? (ja ? '正解です。' : 'Correct.') : (ja ? '惜しい！' : 'Not quite.')}</strong>
              <p>{question.explanation}</p>
            </div>
          )}
          <div className="sq-actions">
            <button type="button" className="ip-primary" disabled={!answered} onClick={next}>
              {position === count - 1 ? (ja ? '結果を見る' : 'See results') : (ja ? '次の問題' : 'Next question')}
              <Glyph name="arrow" size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
