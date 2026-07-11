import { useEffect, useState } from 'react'
import { fetchSkillGap, fetchSkillGaps } from './api/skillGaps'
import type { SkillGap } from './types/skillGap'
import './App.css'

function App() {
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selected, setSelected] = useState<SkillGap | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) return <p>読み込み中...</p>
  if (error) return <p>{error}</p>

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