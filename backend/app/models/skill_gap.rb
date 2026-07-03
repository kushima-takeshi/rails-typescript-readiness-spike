class SkillGap < ApplicationRecord
  has_many :learning_tasks, dependent: :destroy

  enum :status, { not_started: 0, in_progress: 1, done: 2 }

  validates :title, presence: true, length: { maximum: 255 }
  validates :category, presence: true
  validates :current_level, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :target_level, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
end