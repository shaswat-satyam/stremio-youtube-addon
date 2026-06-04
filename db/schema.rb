# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_19_055724) do
  create_table "episodes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.integer "episode_number"
    t.string "imdb_id"
    t.boolean "is_embeddable"
    t.integer "season_id", null: false
    t.datetime "updated_at", null: false
    t.string "youtube_link"
    t.index ["season_id"], name: "index_episodes_on_season_id"
  end

  create_table "movies", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "imdb_id"
    t.boolean "is_embeddable"
    t.string "poster_url"
    t.string "title"
    t.datetime "updated_at", null: false
    t.string "youtube_link"
    t.index ["imdb_id"], name: "index_movies_on_imdb_id"
  end

  create_table "seasons", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "imdb_id"
    t.integer "season_number"
    t.integer "show_id", null: false
    t.datetime "updated_at", null: false
    t.string "youtube_playlist_link"
    t.index ["show_id"], name: "index_seasons_on_show_id"
  end

  create_table "shows", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "imdb_id"
    t.string "poster_url"
    t.string "title"
    t.datetime "updated_at", null: false
  end

  add_foreign_key "episodes", "seasons"
  add_foreign_key "seasons", "shows"
end
