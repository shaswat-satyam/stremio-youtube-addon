class Show < ApplicationRecord
  has_many :seasons, dependent: :destroy
end
