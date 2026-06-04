json.extract! movie, :id, :title, :imdb_id, :youtube_link, :is_embeddable, :created_at, :updated_at
json.url movie_url(movie, format: :json)
