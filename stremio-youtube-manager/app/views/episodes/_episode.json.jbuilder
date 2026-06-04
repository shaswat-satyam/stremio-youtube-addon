json.extract! episode, :id, :season_id, :imdb_id, :episode_number, :youtube_link, :is_embeddable, :created_at, :updated_at
json.url episode_url(episode, format: :json)
