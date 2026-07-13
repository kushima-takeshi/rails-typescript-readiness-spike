import { useEffect, useState } from 'react'
import { createSkillGap, fetchSkillGap, fetchSkillGaps } from './api/skillGaps'
import type { SkillGap } from './types/skillGap'
import './App.css'

function App() {
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selected, setSelected] = useState<SkillGap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [formErrors, setFormErrors] = useState<Record<string, string[]> | null>(null)

  // 一覧を取得
  useEffect(() => {
    fetchSkillGaps()
      .then((data) => setSkillGaps(data))
      .catch(() => setError('SkillGap の取得に失敗しました'))
      .finally(() => setLoading(false))
  }, [])

  // 詳細を取得（selectedId が変わったとき）
  useEffect(() => {
    if (selectedId === null) {
      setSelected(null)
      return
    }

    setLoading(true)
    setError(null)
    fetchSkillGap(selectedId)
      .then((data) => setSelected(data))
      .catch(() => setError('詳細の取得に失敗しました'))
      .finally(() => setLoading(false))
  }, [selectedId])

  function reloadList() {
    setLoading(true)
    setError(null)
    fetchSkillGaps()
      .then((data) => setSkillGaps(data))
      .catch(() => setError('SkillGap の取得に失敗しました'))
      .finally(() => setLoading(false))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()  // ページリロードを防ぐ
    setFormErrors(null)
  
    createSkillGap({ title, category })
      .then(() => {
        setShowForm(false)
        setTitle('')
        setCategory('')
        reloadList()
      })
      .catch((err: { status?: number; body?: { errors?: Record<string, string[]> } }) => {
        if (err.status === 422 && err.body?.errors) {
          setFormErrors(err.body.errors)
        } else {
          setError('作成に失敗しました')
        }
      })
  }

  if (loading) return <p>読み込み中...</p>
  if (error) return <p>{error}</p>

  if (showForm) {
    return (
      <main style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
        <button type="button" onClick={() => { setShowForm(false); setFormErrors(null) }}>
          ← 一覧に戻る
        </button>
        <h1>SkillGap を作成</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label>
              タイトル<br />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%' }}
              />
            </label>
            {formErrors?.title && <p style={{ color: 'red' }}>{formErrors.title.join(', ')}</p>}
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>
              カテゴリ<br />
              <input
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%' }}
              />
            </label>
            {formErrors?.category && <p style={{ color: 'red' }}>{formErrors.category.join(', ')}</p>}
          </div>
          <button type="submit">作成</button>
        </form>
      </main>
    )
  }

  // 詳細画面
  if (selectedId !== null && selected) {
    return (
      <main style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
        <button type="button" onClick={() => setSelectedId(null)}>
          ← 一覧に戻る
        </button>
        <h1>{selected.title}</h1>
        <p>
          {selected.category} / {selected.status}
        </p>
        {selected.reason && <p>{selected.reason}</p>}

        <h2>Learning Tasks</h2>
        {(selected.learning_tasks ?? []).length === 0 ? (
          <p>タスクはまだありません</p>
        ) : (
          <ul>
            {selected.learning_tasks!.map((task) => (
              <li key={task.id}>
                {task.title}（{task.status}）
              </li>
            ))}
          </ul>
        )}
      </main>
    )
  }

  // 一覧画面
  return (
    <main style={{ maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Skill Gaps</h1>
      <button type="button" onClick={() => setShowForm(true)} style={{ marginBottom: '1rem' }}>
        + 新規作成
      </button>
      {skillGaps.length === 0 ? (
        <p>まだありません</p>
      ) : (
        <ul>
          {skillGaps.map((gap) => (
            <li key={gap.id} style={{ marginBottom: '1rem' }}>
              <button
                type="button"
                onClick={() => setSelectedId(gap.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: '#06c',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <strong>{gap.title}</strong>
              </button>
              <div>
                {gap.category} / {gap.status} / tasks: {gap.learning_tasks_count}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

export default App