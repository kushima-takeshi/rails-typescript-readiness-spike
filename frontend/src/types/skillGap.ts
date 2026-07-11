export type SkillGapStatus = 'not_started' | 'in_progress' | 'done'
export type LearningTaskStatus = 'todo' | 'doing' | 'done'

export type LearningTask = {
  id: number
  skill_gap_id: number
  title: string
  status: LearningTaskStatus
  due_date: string | null
  memo: string | null
  created_at: string
  updated_at: string
}

export type SkillGap = {
  id: number
  title: string
  category: string
  current_level: number | null
  target_level: number | null
  reason: string | null
  status: SkillGapStatus
  learning_tasks_count: number
  created_at: string
  updated_at: string
  learning_tasks?: LearningTask[]
}

export type SkillGapCreateInput = {
  title: string
  category: string
  current_level?: number | null
  target_level?: number | null
  reason?: string | null
  status?: SkillGapStatus
}
