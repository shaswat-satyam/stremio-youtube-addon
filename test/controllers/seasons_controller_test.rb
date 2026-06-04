require "test_helper"

class SeasonsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @season = seasons(:one)
  end

  test "should get index" do
    get seasons_url
    assert_response :success
  end

  test "should get new" do
    get new_season_url
    assert_response :success
  end

  test "should create season" do
    assert_difference("Season.count") do
      post seasons_url, params: { season: { imdb_id: @season.imdb_id, season_number: @season.season_number, show_id: @season.show_id, youtube_playlist_link: @season.youtube_playlist_link } }
    end

    assert_redirected_to season_url(Season.last)
  end

  test "should show season" do
    get season_url(@season)
    assert_response :success
  end

  test "should get edit" do
    get edit_season_url(@season)
    assert_response :success
  end

  test "should update season" do
    patch season_url(@season), params: { season: { imdb_id: @season.imdb_id, season_number: @season.season_number, show_id: @season.show_id, youtube_playlist_link: @season.youtube_playlist_link } }
    assert_redirected_to season_url(@season)
  end

  test "should destroy season" do
    assert_difference("Season.count", -1) do
      delete season_url(@season)
    end

    assert_redirected_to seasons_url
  end
end
