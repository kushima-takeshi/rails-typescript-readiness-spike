class CreateSkillGaps < ActiveRecord::Migration[8.1]
  def change
    create_table :skill_gaps do |t|
      t.string :title
      t.string :category
      t.integer :current_level
      t.integer :target_level
      t.text :reason
      t.integer :status

      t.timestamps
    end
  end
end
