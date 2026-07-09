module Api
  module V1
    class SkillGapsController < ApplicationController
      before_action :set_skill_gap, only: %i[show update]

      def index
        skill_gaps = SkillGap.includes(:learning_tasks).order(:id)
        render json: skill_gaps.map { |skill_gap| skill_gap_json(skill_gap) }
      end

      def show
        render json: skill_gap_json(@skill_gap, include_learning_tasks: true)
      end

      def create
        skill_gap = SkillGap.new(skill_gap_params)
        skill_gap.status ||= :not_started

        if skill_gap.save
          render json: skill_gap_json(skill_gap), status: :created
        else
          render_validation_errors(skill_gap)
        end
      end

      def update
        if @skill_gap.update(skill_gap_params)
          render json: skill_gap_json(@skill_gap)
        else
          render_validation_errors(@skill_gap)
        end
      end

      private

      def set_skill_gap
        @skill_gap = SkillGap.find(params[:id])
      end

      def skill_gap_params
        params.require(:skill_gap).permit(
          :title,
          :category,
          :current_level,
          :target_level,
          :reason,
          :status
        )
      end

      def skill_gap_json(skill_gap, include_learning_tasks: false)
        json = {
          id: skill_gap.id,
          title: skill_gap.title,
          category: skill_gap.category,
          current_level: skill_gap.current_level,
          target_level: skill_gap.target_level,
          reason: skill_gap.reason,
          status: skill_gap.status,
          learning_tasks_count: skill_gap.learning_tasks.size,
          created_at: skill_gap.created_at,
          updated_at: skill_gap.updated_at
        }

        if include_learning_tasks
          json[:learning_tasks] = skill_gap.learning_tasks.map { |task| learning_task_json(task) }
        end

        json
      end

      def learning_task_json(task)
        {
          id: task.id,
          skill_gap_id: task.skill_gap_id,
          title: task.title,
          status: task.status,
          due_date: task.due_date,
          memo: task.memo,
          created_at: task.created_at,
          updated_at: task.updated_at
        }
      end
    end
  end
end
