import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

// Exercise the shared player against controlled recording and speech engines.
// Timers are advanced explicitly so cancellation between repetitions is covered.
const components = readFileSync(new URL('./components.jsx', import.meta.url), 'utf8')
const source = components.slice(components.indexOf('export function useAudio('), components.indexOf('export function PhrasePlaybackButton('))
  .replace('export function ', 'function ')
  .replaceAll('import.meta.env.BASE_URL', '"/sou/"')

function playerHarness(recordings = {}) {
  let phase
  let cleanup
  let activeSpeech
  let timerId = 0
  const speech = []
  const audio = []
  const messages = []
  const timers = new Map()
  const player = runInNewContext(`${source}\nuseAudio(notify)`, {
    useLanguage: () => ({ t: key => key }),
    useRef: () => ({ current: null }),
    useState: value => { phase = value; return [value, next => { phase = next }] },
    useEffect: effect => { cleanup = effect() },
    approvedAudio: recordings,
    notify: message => messages.push(message),
    setTimeout: (callback, delay) => { const id = ++timerId; timers.set(id, { callback, delay }); return id },
    clearTimeout: id => timers.delete(id),
    speakKokoroSpeech: async (text, options) => {
      activeSpeech = options
      speech.push({ text, options })
      options.onLoading()
      options.onStart()
    },
    stopKokoroSpeech: () => {
      const previous = activeSpeech
      activeSpeech = null
      previous?.onCancel()
    },
    Audio: class {
      constructor(url) { this.url = url; this.paused = true; audio.push(this) }
      async play() { this.paused = false }
      pause() { this.paused = true }
    },
  })
  return {
    player, speech, audio, messages, timers,
    get phase() { return phase },
    unmount: () => cleanup(),
    async advance() {
      const pending = [...timers.values()]
      timers.clear()
      pending.forEach(({ callback }) => callback())
      await Promise.resolve()
    },
  }
}

test('ordinary playback uses the selected speed and ends after one phrase', async () => {
  const h = playerHarness()
  await h.player.play('phrase', 0.75, false, 'I love it.')
  assert.equal(h.speech[0].options.rate, 0.75)
  assert.equal(h.phase, 'playing')
  h.speech[0].options.onEnd()
  assert.equal(h.phase, 'idle')
  assert.equal(h.timers.size, 0)
})

test('loop waits for the phrase to finish and leaves a gap before repeating', async () => {
  const h = playerHarness()
  await h.player.play('phrase', 0.75, false, 'I love it.', true)
  assert.equal(h.timers.size, 0)
  h.speech[0].options.onEnd()
  assert.equal(h.phase, 'waiting')
  assert.equal([...h.timers.values()][0].delay, 900)
  await h.advance()
  assert.equal(h.speech.length, 2)
  assert.equal(h.speech[1].text, 'I love it.')
  assert.equal(h.speech[1].options.rate, 0.75)
  assert.equal(h.phase, 'playing')
})

test('speed changes restart generated speech and retain the loop setting', async () => {
  const h = playerHarness()
  await h.player.play('phrase', 1, false, 'I love it.', true)
  const stale = h.speech[0].options
  h.player.setSpeed(0.5)
  assert.equal(h.speech.length, 2)
  assert.equal(h.speech[1].options.rate, 0.5)
  stale.onEnd()
  assert.equal(h.timers.size, 0)
  h.speech[1].options.onEnd()
  await h.advance()
  assert.equal(h.speech[2].options.rate, 0.5)
})

test('changing speed during the repeat gap updates the next repetition', async () => {
  const h = playerHarness()
  await h.player.play('phrase', 1, false, 'I love it.', true)
  h.speech[0].options.onEnd()
  h.player.setSpeed(1.25)
  assert.equal(h.speech.length, 1)
  await h.advance()
  assert.equal(h.speech[1].options.rate, 1.25)
})

test('loop can be enabled during playback and disabled during the repeat gap', async () => {
  const h = playerHarness()
  await h.player.play('phrase', 1, false, 'I love it.')
  h.player.setLoop(true)
  h.speech[0].options.onEnd()
  assert.equal(h.timers.size, 1)
  h.player.setLoop(false)
  assert.equal(h.phase, 'idle')
  assert.equal(h.timers.size, 0)
  await h.advance()
  assert.equal(h.speech.length, 1)
})

test('turning loop off during a phrase lets that phrase finish once', async () => {
  const h = playerHarness()
  await h.player.play('phrase', 1, false, 'I love it.', true)
  h.player.setLoop(false)
  assert.equal(h.phase, 'playing')
  h.speech[0].options.onEnd()
  assert.equal(h.phase, 'idle')
  assert.equal(h.timers.size, 0)
})

test('stopping or leaving a phrase cancels pending repetitions and stale completions', async () => {
  for (const unmount of [false, true]) {
    const h = playerHarness()
    await h.player.play('phrase', 1, false, 'I love it.', true)
    const stale = h.speech[0].options
    stale.onEnd()
    if (unmount) h.unmount()
    else h.player.stop()
    stale.onEnd()
    await h.advance()
    assert.equal(h.timers.size, 0)
    assert.equal(h.speech.length, 1)
  }
})

test('replay replaces a pending repetition without scheduling duplicate playback', async () => {
  const h = playerHarness()
  await h.player.play('phrase', 1, false, 'I love it.', true)
  h.speech[0].options.onEnd()
  await h.player.play('phrase', 0.75, true, 'I love it.', true)
  assert.equal(h.timers.size, 0)
  assert.equal(h.speech.length, 2)
  await h.advance()
  assert.equal(h.speech.length, 2)
})

test('speech cancellation and errors do not trigger another loop', async () => {
  for (const callback of ['onCancel', 'onError']) {
    const h = playerHarness()
    await h.player.play('phrase', 1, false, 'I love it.', true)
    h.speech[0].options[callback]()
    await h.advance()
    assert.equal(h.phase, 'idle')
    assert.equal(h.speech.length, 1)
    assert.equal(h.messages.length, callback === 'onError' ? 1 : 0)
  }
})

test('recordings change speed in place and repeat at the latest speed', async () => {
  const h = playerHarness({ phrase: 'audio/model.mp3' })
  await h.player.play('phrase', 1, false, '', true)
  assert.equal(h.audio[0].url, '/sou/audio/model.mp3')
  assert.equal(h.audio[0].preservesPitch, true)
  h.player.setSpeed(0.5)
  assert.equal(h.audio.length, 1)
  assert.equal(h.audio[0].playbackRate, 0.5)
  h.audio[0].onended()
  await h.advance()
  assert.equal(h.audio.length, 2)
  assert.equal(h.audio[1].playbackRate, 0.5)
  h.player.stop()
  assert.equal(h.audio[1].paused, true)
  assert.equal(h.audio[1].onended, null)
  assert.equal(h.timers.size, 0)
})

test('starting another phrase cancels the previous phrase and repeat timer', async () => {
  const h = playerHarness()
  await h.player.play('first', 1, false, 'I love it.', true)
  const stale = h.speech[0].options
  stale.onEnd()
  await h.player.play('next', 1, false, 'That works for me.')
  stale.onEnd()
  await h.advance()
  assert.equal(h.timers.size, 0)
  assert.equal(h.speech.length, 2)
  assert.equal(h.speech[1].text, 'That works for me.')
})
