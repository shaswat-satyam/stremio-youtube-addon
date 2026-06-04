# app/controllers/api/v1/movies_controller.rb
module Api
  module V1
    class MoviesController < ApplicationController

      def index
        render json: Movie.all
      end

      def show
        @movie = Movie.find_by!(imdb_id: params[:id])
        render json: @movie
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Movie not found" }, status: :not_found
      end

      def create
        @movie = Movie.new(movie_params)
        if @movie.save
          render json: @movie, status: :created
        else
          render json: { errors: @movie.errors }, status: :unprocessable_entity
        end
      end

      def update
        if @movie.update(movie_params)
          render json: @movie
        else
          render json: { errors: @movie.errors }, status: :unprocessable_entity
        end
      end

      def destroy
        @movie.destroy
        render json: { message: "Movie deleted" }, status: :ok
      end

      private

      def set_movie
        @movie = Movie.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Movie not found" }, status: :not_found
      end

      def movie_params
        params.require(:movie).permit(:title, :imdb_id, :youtube_link, :is_embeddable)
      end
    end
  end
end
