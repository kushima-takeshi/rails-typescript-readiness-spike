class CreateLearningTasks < ActiveRecord::Migration[8.1]
  def change
    create_table :learning_tasks do |t|
      t.references :skill_gap, null: false, foreign_key: true
      t.string :title
      t.integer :status
      t.date :due_date
      t.text :memo

      t.timestamps
    end
  end
end
