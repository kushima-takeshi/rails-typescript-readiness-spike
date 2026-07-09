Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      resources :skill_gaps, only: %i[index show create update] do
        resources :learning_tasks, only: %i[index create]
      end
    end
  end
end
