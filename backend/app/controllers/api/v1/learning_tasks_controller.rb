module Api
  module V1
    class LearningTasksController < ApplicationController
      before_action :set_skill_gap

      def index
        tasks = @skill_gap.learning_tasks.order(:id)
        render json: tasks.map { |task| learning_task_json(task) }
      end

      def create
        task = @skill_gap.learning_tasks.build(learning_task_params)
        task.status ||= :todo

        if task.save
          render json: learning_task_json(task), status: :created
        else
          render_validation_errors(task)
        end
      end

      private

      def set_skill_gap
        @skill_gap = SkillGap.find(params[:skill_gap_id])
      end

      def learning_task_params
        params.require(:learning_task).permit(:title, :status, :due_date, :memo)
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
