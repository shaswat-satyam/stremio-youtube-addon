class CreateEpisodes < ActiveRecord::Migration[8.1]
  def change
    create_table :episodes do |t|
      t.references :season, null: false, foreign_key: true
      t.string :imdb_id
      t.integer :episode_number
      t.string :youtube_link
      t.boolean :is_embeddable

      t.timestamps
    end
  end
end
