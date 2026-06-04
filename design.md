
We have to store youtube Link, is_embeddable for each movie and each episode

# Movies
- Movie_id: Auto_increment, Primary key, Integer
- Title: Optional, String
- IMDB_id: Required, String
- youtube_link: Required, String
- is_embeddable: Optional, Boolean
- poster: Optional, String

# Shows
- Show_id: Auto_increment, Primary Key, Integer
- Title: Optional, String
- IMDB_id: Required, String
- Has_Many: Seasons
- poster: Optional, String

## Seasons
- IMDB_id: Required, String
- Show_id: Foreign_key, Integer
- Season_id: Autoincrement, Primary Key, Integer
- Season_number: Required, Integer
- youtube_playlist_link: Optional, String
- Has_Many: Episodes

### Episode
- IMDB_id: Required, String
- Season_id: Foreign_key, Integer
- episode_id: Autoincrement, Primary Key, Integer
- episode_number: Optional, Integer
- youtube_link: Optional, String
- is_embeddable: Optional, Boolean

# User
