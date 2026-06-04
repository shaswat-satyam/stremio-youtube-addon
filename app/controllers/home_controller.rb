class HomeController < ApplicationController
  def index
    @movies = Movie.all
    @shows = Show.all
  end
end