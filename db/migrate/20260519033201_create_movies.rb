class CreateMovies < ActiveRecord::Migration[8.1]
  def change
    create_table :movies do |t|
      t.string :title
      t.string :imdb_id
      t.string :youtube_link
      t.boolean :is_embeddable

      t.timestamps
    end
    add_index :movies, :imdb_id
  end
end
