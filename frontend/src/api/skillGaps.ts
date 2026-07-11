import type { SkillGap, SkillGapCreateInput } from '../types/skillGap'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw { status: response.status, body }
  }

  return response.json() as Promise<T>
}

export function fetchSkillGaps(): Promise<SkillGap[]> {
  return request<SkillGap[]>('/api/v1/skill_gaps')
}

export function fetchSkillGap(id: number): Promise<SkillGap> {
  return request<SkillGap>(`/api/v1/skill_gaps/${id}`)
}

export function createSkillGap(input: SkillGapCreateInput): Promise<SkillGap> {
  return request<SkillGap>('/api/v1/skill_gaps', {
    method: 'POST',
    body: JSON.stringify({ skill_gap: input }),
  })
}
