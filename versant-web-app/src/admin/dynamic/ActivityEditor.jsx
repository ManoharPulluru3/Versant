import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { API_ORIGIN, adminApi, adminAudio, adminUpload } from '../api'
import { Notice, inputClass } from './ui'

function blankQuestion() {
  return {
    prompt: '',
    answer: 'A',
    options: [
      { text: '' },
      { text: '' },
      { text: '' },
      { text: '' },
    ],
  }
}

const LEVELS = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced']
const AUDIO_LABELS = ['Conversation', 'Passage', 'Audio']
const LETTERS = ['A', 'B', 'C', 'D']

const blank = {
  title: '',
  description: '',
  duration: '5 min',
  level: 'Intermediate',
  audioLabel: 'Audio',
  script: '',
  voice: 'en-IN-NeerjaNeural',
  audioSource: 'tts',
  audioUrl: null,
  headline: '',
  subtitle: '',
  audioSeconds: 15,
  questionSeconds: 45,
  tip: 'Listen for the main idea, then choose the best answer.',
  published: true,
  questions: [],
}

export default function ActivityEditor() {
  const [params] = useSearchParams()
  const id = params.get('id')
  const navigate = useNavigate()
  const [form, setForm] = useState(blank)
  const [file, setFile] = useState(null)
  const [voices, setVoices] = useState([
    { id: 'en-IN-NeerjaNeural', name: 'Female', gender: 'Female' },
    { id: 'en-IN-PrabhatNeural', name: 'Male', gender: 'Male' },
  ])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [previewing, setPreviewing] = useState(false)
  const [playingPreview, setPlayingPreview] = useState(false)
  const previewAudioRef = useRef(null)
  const [transcribing, setTranscribing] = useState(false)
  const [scriptBrief, setScriptBrief] = useState('')
  const [scriptKind, setScriptKind] = useState('passage')
  const [scriptModal, setScriptModal] = useState(false)
  const [questionModal, setQuestionModal] = useState(false)
  const [questionContext, setQuestionContext] = useState('')
  const [questionPrompt, setQuestionPrompt] = useState('')
  const [writingScript, setWritingScript] = useState(false)
  const [writingQuestions, setWritingQuestions] = useState(false)

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  useEffect(() => {
    if (!scriptModal && !questionModal) return undefined
    function onKey(event) {
      if (event.key !== 'Escape') return
      if (scriptModal && !writingScript) setScriptModal(false)
      if (questionModal && !writingQuestions) setQuestionModal(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [scriptModal, questionModal, writingScript, writingQuestions])

  useEffect(() => {
    adminApi('/admin/voices')
      .then((data) => setVoices(data.voices ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!id) return undefined
    let active = true
    adminApi('/admin/activities')
      .then((data) => {
        const activity = data.activities.find((item) => item.id === id)
        if (active && activity) {
          const knownVoice = ['en-IN-NeerjaNeural', 'en-IN-PrabhatNeural'].includes(activity.voice)
          setForm({
            ...activity,
            voice: knownVoice ? activity.voice : 'en-IN-NeerjaNeural',
            questions: activity.questions.map((question) => ({
              id: question.id,
              prompt: question.prompt,
              answer: question.answer,
              options: [...question.options, { text: '' }, { text: '' }, { text: '' }, { text: '' }].slice(0, 4),
            })),
          })
        }
      })
      .catch((err) => {
        if (active) setError(err.message)
      })
    return () => {
      active = false
    }
  }, [id])

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateQuestion(index, patch) {
    setForm((current) => ({
      ...current,
      questions: current.questions.map((question, itemIndex) => (itemIndex === index ? { ...question, ...patch } : question)),
    }))
  }

  function removeQuestion(index) {
    setForm((current) => ({
      ...current,
      questions: current.questions.filter((_, itemIndex) => itemIndex !== index),
    }))
  }

  async function save() {
    setBusy(true)
    setError('')
    setNotice('')
    const audioSource = form.audioSource === 'upload' ? 'upload' : 'tts'
    if (audioSource === 'tts' && !form.script.trim()) {
      setBusy(false)
      setError('Write the script that should be read aloud.')
      return
    }
    if (audioSource === 'upload' && !file && !form.audioUrl) {
      setBusy(false)
      setError('Upload a recording, or switch to speech from a script.')
      return
    }
    const body = {
      ...form,
      headline: String(form.headline ?? '').trim() || form.title,
      subtitle: String(form.subtitle ?? '').trim() || form.description,
      audioSource,
      questions: form.questions
        .map((question) => ({
          ...question,
          options: question.options.filter((option) => option.text.trim()),
        }))
        .filter((question) => question.prompt.trim()),
    }
    try {
      const saved = id
        ? await adminApi(`/admin/activities/${id}`, { method: 'PUT', body: JSON.stringify(body) })
        : await adminApi('/admin/activities', { method: 'POST', body: JSON.stringify(body) })
      const activityId = saved.activity.id
      let activity = saved.activity
      if (audioSource === 'tts') {
        const spoken = await adminApi(`/admin/activities/${activityId}/speech`, {
          method: 'POST',
          body: JSON.stringify({ script: form.script, voice: form.voice }),
        })
        activity = spoken.activity
      } else if (file) {
        const data = new FormData()
        data.append('audio', file)
        data.append('script', form.script)
        const uploaded = await adminUpload(`/admin/activities/${activityId}/audio`, data)
        activity = uploaded.activity
      }
      setForm((current) => ({
        ...current,
        ...activity,
        questions: activity.questions.map((question) => ({
          id: question.id,
          prompt: question.prompt,
          answer: question.answer,
          options: [...question.options, { text: '' }, { text: '' }, { text: '' }, { text: '' }].slice(0, 4),
        })),
      }))
      setFile(null)
      setNotice(
        audioSource === 'tts'
          ? 'Saved. The script was read aloud as one recording.'
          : 'Saved. Students will hear your recording, and the transcript is ready for your questions.',
      )
      if (!id) navigate(`/admin/question-bank/editor?id=${activityId}`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  function stopPreview() {
    const audio = previewAudioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setPlayingPreview(false)
  }

  function clearPreview() {
    stopPreview()
    const audio = previewAudioRef.current
    if (audio) {
      audio.removeAttribute('src')
      audio.load()
    }
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return null
    })
  }

  function togglePreview() {
    if (playingPreview) {
      stopPreview()
      return
    }
    const audio = previewAudioRef.current
    if (previewUrl && audio) {
      audio.play().catch(() => setError('The voice preview could not play.'))
      return
    }
    previewVoice()
  }

  async function onRecording(nextFile) {
    setFile(nextFile)
    clearPreview()
    if (!nextFile) return
    setTranscribing(true)
    setError('')
    setNotice('')
    set('script', '')
    try {
      const data = new FormData()
      data.append('audio', nextFile)
      const transcript = await adminUpload('/admin/speech/transcribe', data)
      set('script', transcript.script)
      if (transcript.seconds) set('audioSeconds', transcript.seconds)
      setNotice(
        transcript.trimmed
          ? 'Transcript is ready, shortened to fit. Check it before you save.'
          : 'Transcript is ready. Check it, then write questions from it and save.',
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setTranscribing(false)
    }
  }

  async function writeScript() {
    if (!scriptBrief.trim() && !form.title.trim()) {
      setError('Describe what the clip should be about.')
      return
    }
    if (form.script.trim() && !window.confirm('Replace the current script? Your questions will stay as they are.')) return
    setWritingScript(true)
    setError('')
    setNotice('')
    try {
      const draft = await adminApi('/admin/ai/script', {
        method: 'POST',
        body: JSON.stringify({
          brief: scriptBrief.trim() || form.title,
          kind: scriptKind,
          level: form.level,
        }),
      })
      set('script', draft.script)
      if (scriptKind === 'conversation') set('audioLabel', 'Conversation')
      else if (form.audioLabel === 'Audio' || form.audioLabel === 'Conversation') set('audioLabel', 'Passage')
      clearPreview()
      setScriptModal(false)
      setNotice('Script is ready. Questions were not changed.')
    } catch (err) {
      setError(err.message)
    } finally {
      setWritingScript(false)
    }
  }

  function openQuestionModal() {
    const source = form.script.trim()
    if (!source) {
      setError(writing ? 'Write or generate a script first.' : 'Upload a recording so there is a transcript to use.')
      return
    }
    setQuestionContext(form.script)
    setQuestionPrompt('')
    setError('')
    setQuestionModal(true)
  }

  async function writeQuestions() {
    const source = questionContext.trim()
    if (source.length < 40) {
      setError('The context is too short. Use the script from step 2.')
      return
    }
    if (!questionPrompt.trim()) {
      setError('Say how many questions to write.')
      return
    }
    const hasQuestions = form.questions.some((question) => question.prompt.trim())
    if (hasQuestions && !window.confirm('Replace the current questions? The script will stay as it is.')) return
    setWritingQuestions(true)
    setError('')
    setNotice('')
    try {
      const draft = await adminApi('/admin/ai/questions', {
        method: 'POST',
        body: JSON.stringify({ script: source, instruction: questionPrompt, level: form.level }),
      })
      set(
        'questions',
        draft.questions.map((question) => ({
          prompt: question.prompt,
          answer: question.answer,
          options: [...question.options, { text: '' }, { text: '' }, { text: '' }, { text: '' }].slice(0, 4),
        })),
      )
      setQuestionModal(false)
      setNotice('Questions were written from the script. The script was not changed.')
    } catch (err) {
      setError(err.message)
    } finally {
      setWritingQuestions(false)
    }
  }

  async function previewVoice() {
    setError('')
    setNotice('')
    if (!form.script.trim()) {
      setError('Write a script first, then preview the voice.')
      return
    }
    setPreviewing(true)
    try {
      const blob = await adminAudio('/admin/speech/preview', { script: form.script, voice: form.voice })
      const url = URL.createObjectURL(blob)
      const audio = previewAudioRef.current
      if (audio) audio.src = url
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current)
        return url
      })
      if (audio) {
        try {
          await audio.play()
        } catch {
          setPlayingPreview(false)
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setPreviewing(false)
    }
  }

  const writing = form.audioSource !== 'upload'
  const scriptLimit = writing ? 4000 : 12000
  const scriptLength = (form.script || '').length
  const questionReady = form.questions.some(
    (question) => question.prompt.trim() && question.options.filter((option) => option.text.trim()).length >= 2,
  )
  const checks = [
    { ok: Boolean(form.title.trim()), label: 'Activity name' },
    { ok: writing ? Boolean(form.script.trim()) : Boolean(file || form.audioUrl), label: writing ? 'Step 2 · Script' : 'Step 2 · Recording' },
    { ok: questionReady, label: 'Step 3 · Questions' },
  ]


  return (
    <div className="flex w-full flex-col gap-5 px-5 py-6 sm:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-start gap-3">
          <Link
            to="/admin/question-bank"
            aria-label="Back to question bank"
            className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#DFE4DE] bg-white text-[#657069] hover:bg-[#F5F6F2]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 6L9 12L15 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Link>
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-[#9AA19C]">
              <Link to="/admin/question-bank" className="hover:text-brand">Question Bank</Link>
              <span>/</span>
              <span className="font-bold text-[#303A34]">{id ? 'Edit activity' : 'New activity'}</span>
            </div>
            <h1 className="text-[26px] font-extrabold tracking-tight">
              {id ? form.title || 'Edit listening activity' : 'New listening activity'}
            </h1>
            <p className="mt-1 max-w-2xl text-[14px] font-semibold text-[#59635D]">
              Name the activity, then write or upload what students will hear.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={busy || transcribing || writingScript || writingQuestions}
          className="h-11 rounded-xl bg-brand px-5 text-[14px] font-extrabold text-white hover:bg-[#18583F] disabled:opacity-50"
        >
          {busy ? 'Saving…' : transcribing ? 'Reading recording…' : 'Save activity'}
        </button>
      </div>

      {error ? <Notice>{error}</Notice> : null}
      {notice ? (
        <p className="rounded-2xl bg-brand-light px-4 py-3 text-sm font-semibold text-brand">{notice}</p>
      ) : null}

      <div className="grid w-full grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          <Section step="1" title="Activity" note="Name it, and add a short note. Students do not see this note.">
            <div className="grid gap-3">
              <label className="block">
                <span className="mb-2 block text-[13px] font-extrabold text-[#17221D]">Name</span>
                <input
                  className={`${inputClass} bg-white`}
                  value={form.title}
                  placeholder="Library hours"
                  onChange={(event) => set('title', event.target.value)}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-[13px] font-extrabold text-[#17221D]">Instructions note</span>
                <textarea
                  className={`${inputClass} h-24 bg-white py-3`}
                  value={form.description}
                  placeholder="A short note for faculty about this activity"
                  onChange={(event) => set('description', event.target.value)}
                />
              </label>
            </div>
          </Section>

          <Section
            step="2"
            title={writing ? 'The script' : 'The recording'}
            note={writing ? 'These words are read aloud. Students never see them.' : 'Upload the audio. The transcript appears below. Students never see it.'}
            action={
              <div className="flex shrink-0 rounded-xl bg-[#F0F3EE] p-1">
                <button
                  type="button"
                  onClick={() => set('audioSource', 'tts')}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-extrabold ${writing ? 'bg-white text-brand shadow-sm' : 'text-[#59635D]'}`}
                >
                  <PenIcon />
                  Write a script
                </button>
                <button
                  type="button"
                  onClick={() => set('audioSource', 'upload')}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[12px] font-extrabold ${!writing ? 'bg-white text-brand shadow-sm' : 'text-[#59635D]'}`}
                >
                  <UploadIcon />
                  Upload audio
                </button>
              </div>
            }
          >
            {!writing ? (
              <label className={`mb-4 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed px-4 py-3 ${transcribing ? 'border-brand bg-[#F4F8F5]' : 'border-[#C9D2C8] bg-[#F8F9F5] hover:border-brand'}`}>
                <span className="text-[14px] font-extrabold">{transcribing ? 'Reading the recording…' : file ? file.name : 'Choose an mp3, wav, or m4a file'}</span>
                <span className="text-[12px] font-bold text-muted">{transcribing ? 'Filling the transcript' : 'Browse'}</span>
                <input
                  className="sr-only"
                  type="file"
                  accept="audio/*"
                  disabled={transcribing || busy}
                  onChange={(event) => onRecording(event.target.files?.[0] ?? null)}
                />
              </label>
            ) : null}

            <div>
              <span className="mb-2 flex items-center justify-between text-[13px] font-extrabold text-[#17221D]">
                {writing ? 'Script' : 'Transcript'}
                <span className={scriptLength > scriptLimit ? 'text-[#B65F39]' : 'font-semibold text-[#9AA19C]'}>
                  {scriptLength}/{scriptLimit}
                </span>
              </span>
              <div className="relative">
                <textarea
                  className={`h-64 w-full resize-y rounded-2xl border border-[#E4E8E2] bg-[#F8FAF7] p-4 text-[15px] font-semibold leading-7 outline-none focus:border-brand focus:bg-white disabled:opacity-60 ${writing ? 'pb-16' : ''}`}
                  value={form.script || ''}
                  disabled={transcribing}
                  placeholder={writing ? 'Type the words students will hear.' : 'The transcript appears here after you upload a recording.'}
                  onChange={(event) => {
                    set('script', event.target.value)
                    if (previewUrl) clearPreview()
                  }}
                />
                {writing ? (
                  <>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                      <div className="flex rounded-lg bg-white p-0.5 shadow-sm ring-1 ring-[#E4E8E2]">
                        {voices.map((voice) => {
                          const selected = (form.voice || 'en-IN-NeerjaNeural') === voice.id
                          return (
                            <button
                              key={voice.id}
                              type="button"
                              onClick={() => {
                                set('voice', voice.id)
                                clearPreview()
                              }}
                              className={`inline-flex h-7 items-center gap-1 rounded-md px-2 text-[11px] font-extrabold ${selected ? 'bg-brand text-white' : 'text-[#59635D]'}`}
                            >
                              {voice.name === 'Male' ? <MaleIcon /> : <FemaleIcon />}
                              {voice.name}
                            </button>
                          )
                        })}
                      </div>
                      <button
                        type="button"
                        aria-label={playingPreview ? 'Stop this voice' : 'Play this voice'}
                        onClick={togglePreview}
                        disabled={previewing || busy || !form.script.trim()}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand shadow-sm ring-1 ring-[#E4E8E2] disabled:opacity-40"
                      >
                        {previewing ? (
                          <span className="text-[11px] font-extrabold">…</span>
                        ) : playingPreview ? (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                            <rect x="1" y="1" width="8" height="8" rx="1" />
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                            <path d="M3 1.5v9l8-4.5-8-4.5Z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScriptModal(true)}
                      className="absolute bottom-3 right-3 inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#E58A45] px-3 text-[12px] font-extrabold text-white shadow-sm hover:bg-[#CF7632]"
                    >
                      <SparkIcon />
                      Generate script with AI
                    </button>
                  </>
                ) : null}
              </div>
            </div>
            <div className={`mt-3 items-center gap-2 rounded-xl border border-[#E4E8E2] bg-white px-2 py-1.5 ${previewUrl ? 'flex' : 'hidden'}`}>
              <button
                type="button"
                aria-label="Stop"
                onClick={stopPreview}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F3EE] text-brand"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
                  <rect x="1" y="1" width="8" height="8" rx="1" />
                </svg>
              </button>
              <audio
                ref={previewAudioRef}
                className="h-10 min-w-0 flex-1"
                controls
                onPlay={() => setPlayingPreview(true)}
                onPause={() => setPlayingPreview(false)}
                onEnded={() => setPlayingPreview(false)}
              />
            </div>
            {form.audioUrl ? (
              <div className="mt-4 rounded-2xl border border-[#E5E9E3] bg-[#F5F6F2] p-4">
                <p className="mb-2 text-[12px] font-extrabold uppercase tracking-wider text-[#949C96]">Saved recording</p>
                <audio key={form.audioUrl} className="w-full" controls src={`${API_ORIGIN}${form.audioUrl}`} />
              </div>
            ) : null}
          </Section>

          <Section
            step="3"
            title="The questions"
            note="Students answer these after the clip. The green letter is the correct choice."
            action={
              form.questions.length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    if (!window.confirm('Clear all questions?')) return
                    set('questions', [])
                  }}
                  className="shrink-0 rounded-lg px-2 py-1 text-[13px] font-extrabold text-[#B65F39] hover:bg-[#FBF4EF]"
                >
                  Clear all
                </button>
              ) : null
            }
          >
            {form.questions.length === 0 ? (
              <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-[#D5DBD4] bg-[#F8F9F5] px-6 text-center">
                <p className="text-[16px] font-extrabold">No questions yet</p>
                <p className="mt-1 max-w-sm text-[13px] font-semibold text-muted">Add a question yourself, or generate them from the script in step 2.</p>
              </div>
            ) : null}
            <div className="space-y-4">
              {form.questions.map((question, index) => (
                <article key={question.id || index} className="rounded-2xl border border-[#E6EBE4] bg-[#FBFCF9] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-[12px] font-extrabold text-white">{index + 1}</span>
                      <span className="text-[13px] font-extrabold text-[#68726C]">Question</span>
                    </div>
                    <button type="button" onClick={() => removeQuestion(index)} className="text-[13px] font-extrabold text-[#B65F39]">
                      Remove
                    </button>
                  </div>
                  <textarea
                    className="h-24 w-full resize-none rounded-xl border border-[#E4E8E2] bg-white p-3 text-[15px] font-semibold leading-6 outline-none focus:border-brand"
                    value={question.prompt}
                    placeholder="What should the student answer from the clip?"
                    onChange={(event) => updateQuestion(index, { prompt: event.target.value })}
                  />
                  <div className="mt-3 space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const optionId = LETTERS[optionIndex]
                      const selected = question.answer === optionId
                      return (
                        <div
                          key={optionId}
                          className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${selected ? 'border-brand bg-[#F1F7F2]' : 'border-[#E1E6DF] bg-white'}`}
                        >
                          <button
                            type="button"
                            aria-label={`Mark ${optionId} correct`}
                            onClick={() => updateQuestion(index, { answer: optionId })}
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-extrabold ${
                              selected ? 'bg-brand text-white' : 'bg-[#F0F3EE] text-[#68726C]'
                            }`}
                          >
                            {optionId}
                          </button>
                          <input
                            className="h-9 w-full bg-transparent text-[14px] font-bold outline-none"
                            value={option.text}
                            placeholder={selected ? 'Correct choice' : 'Choice'}
                            onChange={(event) => {
                              const options = question.options.map((item, itemIndex) =>
                                itemIndex === optionIndex ? { text: event.target.value } : item,
                              )
                              updateQuestion(index, { options })
                            }}
                          />
                        </div>
                      )
                    })}
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => set('questions', [...form.questions, blankQuestion()])}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-[#C9D2C8] bg-white px-4 text-[14px] font-extrabold text-brand hover:bg-[#F4F8F5]"
              >
                <PlusIcon />
                Question
              </button>
              <button
                type="button"
                onClick={openQuestionModal}
                disabled={writingQuestions || busy || transcribing || writingScript}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-[#3D6B99] px-4 text-[14px] font-extrabold text-white hover:bg-[#315780] disabled:opacity-50"
              >
                <SparkIcon />
                Generate with AI
              </button>
            </div>
          </Section>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-5">
          <Section kicker="Ready to save" title="Checklist">
            <ul className="space-y-2">
              {checks.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-[13px] font-bold">
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${item.ok ? 'bg-brand text-white' : 'bg-[#EEF1EC] text-[#9AA19C]'}`}>
                    {item.ok ? '✓' : ''}
                  </span>
                  <span className={item.ok ? 'text-dark' : 'text-muted'}>{item.label}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section kicker="Not the script" title="What students see">
            <Field label="Headline">
              <input className={inputClass} value={form.headline} placeholder={form.title || 'Shown above the clip'} onChange={(event) => set('headline', event.target.value)} />
            </Field>
            <Field label="Subtitle">
              <textarea
                className={`${inputClass} mt-3 h-20 py-3`}
                value={form.subtitle}
                placeholder={form.description || 'A short instruction under the headline'}
                onChange={(event) => set('subtitle', event.target.value)}
              />
            </Field>
            <div className="mt-4">
              <p className="mb-2 text-[13px] font-extrabold text-[#68726C]">Clip label</p>
              <div className="mb-2 flex flex-wrap gap-2">
                {AUDIO_LABELS.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => set('audioLabel', label)}
                    className={`rounded-lg px-2.5 py-1 text-[12px] font-extrabold ${form.audioLabel === label ? 'bg-brand text-white' : 'bg-[#F0F3EE] text-[#59635D]'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <input className={inputClass} value={form.audioLabel} onChange={(event) => set('audioLabel', event.target.value)} />
            </div>
          </Section>

          <Section kicker="Optional" title="Timing and publish">
            <Field label="Level">
              <select className={inputClass} value={LEVELS.includes(form.level) ? form.level : 'Intermediate'} onChange={(event) => set('level', event.target.value)}>
                {LEVELS.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </Field>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Field label="Duration label">
                <input className={inputClass} value={form.duration} onChange={(event) => set('duration', event.target.value)} />
              </Field>
              <Field label="Seconds per question">
                <input className={inputClass} type="number" value={form.questionSeconds} onChange={(event) => set('questionSeconds', Number(event.target.value))} />
              </Field>
            </div>
            <Field label="Clip length (seconds)">
              <input className={`${inputClass} mt-3`} type="number" value={form.audioSeconds} onChange={(event) => set('audioSeconds', Number(event.target.value))} />
            </Field>
            <Field label="Tip">
              <textarea className={`${inputClass} mt-3 h-20 py-3`} value={form.tip} onChange={(event) => set('tip', event.target.value)} />
            </Field>
            <button
              type="button"
              onClick={() => set('published', !form.published)}
              className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#F5F6F2] px-3 py-3 text-left"
            >
              <span>
                <span className="block text-[13px] font-extrabold">Published</span>
                <span className="text-[12px] font-semibold text-muted">{form.published ? 'Students can be assigned this activity' : 'Hidden from new assignments'}</span>
              </span>
              <span className={`relative h-6 w-11 rounded-full ${form.published ? 'bg-brand' : 'bg-[#D5DBD5]'}`}>
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm ${form.published ? 'left-5' : 'left-0.5'}`} />
              </span>
            </button>
          </Section>
        </aside>
      </div>

      {scriptModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17221D]/40 p-4"
          onClick={() => {
            if (!writingScript) setScriptModal(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="script-ai-title"
            className="w-full max-w-lg rounded-2xl border border-[#F0D7C2] bg-[#FFF8F2] p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold tracking-wide text-[#E58A45]">SCRIPT ONLY</p>
                <h2 id="script-ai-title" className="mt-1 text-[18px] font-extrabold">Generate with AI</h2>
                <p className="mt-1 text-[13px] font-semibold text-[#7A4E28]">This writes the script. It does not create questions.</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setScriptModal(false)}
                disabled={writingScript}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#7A4E28] hover:bg-white disabled:opacity-50"
              >
                ×
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                ['passage', 'Passage'],
                ['conversation', 'Conversation'],
              ].map(([kind, label]) => (
                <button
                  key={kind}
                  type="button"
                  onClick={() => setScriptKind(kind)}
                  className={`rounded-lg px-3 py-1.5 text-[13px] font-extrabold ${scriptKind === kind ? 'bg-[#E58A45] text-white' : 'bg-white text-[#7A4E28]'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <textarea
              className="mt-3 h-36 w-full resize-none rounded-2xl border border-[#F0D7C2] bg-white p-4 text-[15px] font-semibold leading-6 outline-none focus:border-[#E58A45]"
              value={scriptBrief}
              placeholder="A student asks when the library closes and where to return books"
              onChange={(event) => setScriptBrief(event.target.value)}
            />
            {error ? <p className="mt-3 text-sm font-semibold text-[#B65F39]">{error}</p> : null}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setScriptModal(false)}
                disabled={writingScript}
                className="h-10 rounded-xl border border-[#F0D7C2] bg-white px-4 text-[13px] font-extrabold text-[#7A4E28] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={writeScript}
                disabled={writingScript || busy || transcribing}
                className="h-10 rounded-xl bg-[#E58A45] px-4 text-[13px] font-extrabold text-white hover:bg-[#CF7632] disabled:opacity-50"
              >
                {writingScript ? 'Writing script…' : 'Write script'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {questionModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#17221D]/40 p-4"
          onClick={() => {
            if (!writingQuestions) setQuestionModal(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="question-ai-title"
            className="w-full max-w-lg rounded-2xl border border-[#D5E3F2] bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold tracking-wide text-[#3D6B99]">QUESTIONS ONLY</p>
                <h2 id="question-ai-title" className="mt-1 text-[18px] font-extrabold">Generate with AI</h2>
                <p className="mt-1 text-[13px] font-semibold text-[#2C4A6E]">The script stays as it is. This only writes questions.</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setQuestionModal(false)}
                disabled={writingQuestions}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-[#2C4A6E] hover:bg-[#F4F8FC] disabled:opacity-50"
              >
                ×
              </button>
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#17221D]">Context from step 2</span>
              <textarea
                className="h-36 w-full resize-none rounded-2xl border border-[#D5E3F2] bg-[#F4F8FC] p-4 text-[14px] font-semibold leading-6 outline-none focus:border-[#3D6B99]"
                value={questionContext}
                onChange={(event) => setQuestionContext(event.target.value)}
              />
            </label>
            <label className="mt-3 block">
              <span className="mb-2 block text-[13px] font-extrabold text-[#17221D]">How many questions</span>
              <textarea
                className="h-24 w-full resize-none rounded-2xl border border-[#E4E8E2] bg-white p-4 text-[15px] font-semibold leading-6 outline-none focus:border-[#3D6B99]"
                value={questionPrompt}
                placeholder="Generate 4 questions"
                onChange={(event) => setQuestionPrompt(event.target.value)}
              />
            </label>
            {error ? <p className="mt-3 text-sm font-semibold text-[#B65F39]">{error}</p> : null}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setQuestionModal(false)}
                disabled={writingQuestions}
                className="h-10 rounded-xl border border-[#D5E3F2] bg-white px-4 text-[13px] font-extrabold text-[#2C4A6E] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={writeQuestions}
                disabled={writingQuestions || busy}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#3D6B99] px-4 text-[13px] font-extrabold text-white hover:bg-[#315780] disabled:opacity-50"
              >
                <SparkIcon />
                {writingQuestions ? 'Writing questions…' : 'Generate questions'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Icon({ children }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {children}
    </svg>
  )
}

function PenIcon() {
  return (
    <Icon>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </Icon>
  )
}

function UploadIcon() {
  return (
    <Icon>
      <path d="M12 16V4" />
      <path d="m7 8 5-5 5 5" />
      <path d="M4 20h16" />
    </Icon>
  )
}

function FemaleIcon() {
  return (
    <Icon>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M12 11v7" />
      <path d="M9 15h6" />
    </Icon>
  )
}

function MaleIcon() {
  return (
    <Icon>
      <circle cx="10" cy="14" r="3.2" />
      <path d="m12.5 11.5 6-6" />
      <path d="M14 5.5h4.5V10" />
    </Icon>
  )
}

function SparkIcon() {
  return (
    <Icon>
      <path d="M12 3l1.4 4.2L18 8.5l-4.6 1.3L12 14l-1.4-4.2L6 8.5l4.6-1.3L12 3Z" />
      <path d="M18 14l.6 1.8L20.5 16.5 18.6 17 18 19l-.6-2-1.9-.5 1.9-.7L18 14Z" />
    </Icon>
  )
}

function PlusIcon() {
  return (
    <Icon>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </Icon>
  )
}

function Section({ step, kicker, title, note, action, children }) {
  return (
    <section className="rounded-2xl border border-[#E2E7E1] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {step ? (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#17221D] text-[15px] font-extrabold text-white">
              {step}
            </span>
          ) : null}
          <div>
            {kicker ? <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#949C96]">{kicker}</div> : null}
            <h2 className="text-[18px] font-extrabold tracking-tight">{title}</h2>
            {note ? <p className="mt-1 text-[13px] font-semibold leading-5 text-[#59635D]">{note}</p> : null}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] font-extrabold text-[#68726C]">{label}</span>
      {children}
    </label>
  )
}
