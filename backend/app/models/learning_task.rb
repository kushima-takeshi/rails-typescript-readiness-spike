class LearningTask < ApplicationRecord
  belongs_to :skill_gap

  enum :status, { todo: 0, doing: 1, done: 2 }

  validates :title, presence: true, length: { maximum: 255 }
end