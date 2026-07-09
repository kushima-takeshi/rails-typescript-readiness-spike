class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private

  def not_found
    render json: { error: "Not Found" }, status: :not_found
  end

  def render_validation_errors(record)
    render json: { errors: record.errors }, status: :unprocessable_entity
  end
end
