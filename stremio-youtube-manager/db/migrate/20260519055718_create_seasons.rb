class CreateSeasons < ActiveRecord::Migration[8.1]
  def change
    create_table :seasons do |t|
      t.references :show, null: false, foreign_key: true
      t.string :imdb_id
      t.integer :season_number
      t.string :youtube_playlist_link

      t.timestamps
    end
  end
end
