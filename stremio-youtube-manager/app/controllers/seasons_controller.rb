class SeasonsController < ApplicationController
  before_action :set_show
  before_action :set_season, only: [:show, :edit, :update, :destroy]

  def index
    @seasons = @show.seasons.order(:season_number)
  end

  def show
  end

  def new
    @season = @show.seasons.new
  end

  def edit
  end

  def create
    @season = @show.seasons.new(season_params)
    if @season.save
      redirect_to show_season_path(@show, @season), notice: "Season created!"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @season.update(season_params)
      redirect_to show_season_path(@show, @season), notice: "Season updated!"
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @season.destroy!
    redirect_to show_path(@show), notice: "Season deleted."
  end

  private

  def set_show
    @show = Show.find(params[:show_id])
  end

  def set_season
    @season = @show.seasons.find(params[:id])
  end

  def season_params
    params.expect(season: [:imdb_id, :season_number, :youtube_playlist_link])
  end
end