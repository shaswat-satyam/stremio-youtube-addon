require 'net/http'
require 'net/https'
require 'uri'
class Movie < ApplicationRecord
  validates :youtube_link, presence: true
  validates :imdb_id, presence: true

  after_commit :fetch_poster, on: :create
  after_commit :fetch_poster, on: :update, if: :saved_change_to_imdb_id?

  def youtube_embed_url
    return nil if youtube_link.blank?
    video_id = youtube_link[/(?:v=|\/embed\/|youtu\.be\/)([^&?\/]+)/, 1]
    "https://www.youtube.com/embed/#{video_id}" if video_id
  end
  OMDB_API_KEY = Rails.application.credentials.omdb_api_key

  def fetch_poster
    response = Net::HTTP.get(URI("https://www.omdbapi.com/?i=#{imdb_id}&apikey=#{OMDB_API_KEY}"))
    data = JSON.parse(response)
    url = data["Poster"]
    p url
    update_column(:poster_url, url) if url && url != "N/A"
  end
end
