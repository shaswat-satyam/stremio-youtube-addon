class CreateShows < ActiveRecord::Migration[8.1]
  def change
    create_table :shows do |t|
      t.string :title
      t.string :imdb_id
      t.string :poster_url

      t.timestamps
    end
  end
end
