# app/models/season.rb
class Season < ApplicationRecord
  belongs_to :show
  has_many :episodes, dependent: :destroy
  validates :season_number, presence: true
end
