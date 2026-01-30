#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;

use sea_orm::{Order,QueryOrder};
use crate::{
    models::_entities::{
        movies::{ Column as MovieColumn,
                  Entity as MovieEntity,
                  Model as MovieModel,
                },
        tvs::{ Column as TvColumn,
               Entity as TvEntity,
               Model as TvModel,
            },
        series::{ Column as SeriesColumn,
                  Entity as SeriesEntity,
                  Model as SeriesModel,
                },
        seasons::{ Column as SeasonColumn,
                   Entity as SeasonEntity,
                   Model  as SeasonModel,
                } ,
        episodes::{ Column as EpisodeColumn,
                    Entity as EpisodeEntity,
                    Model as EpisodeModel
                },
}
};



use serde::Serialize;

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    pub error: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn ok(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            error: None,
        }
    }

    pub fn err(msg: impl Into<String>) -> Self {
        Self {
            success: false,
            data: None,
            error: Some(msg.into()),
        }
    }
}



pub async fn index() -> Result<Response> {
    format::json(ApiResponse::ok("Api is working"))
}

pub async fn movies(
    State(ctx): State<AppContext>
) -> Result<Response> {
    let movies = MovieEntity::find()
        .order_by(MovieColumn::Id, Order::Desc)
        .all(&ctx.db)
        .await?;
    format::json(ApiResponse::ok(movies))

}

pub async fn movie(
    Path(imdb_id): Path<String>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let movies = MovieEntity::find()
        .filter(MovieColumn::ImdbId.eq(imdb_id))
        .order_by(MovieColumn::UpdatedAt, Order::Desc)
        .all(&ctx.db)
        .await?;

    if movies.is_empty() {
        format::json(ApiResponse::<Vec<MovieModel>>::err("Movie not found"))
    } else {
        format::json(ApiResponse::ok(movies))
    }
}

pub async fn tvs(
    State(ctx): State<AppContext>
) -> Result<Response> {
    let tvs = TvEntity::find()
                    .order_by(TvColumn::UpdatedAt, Order::Desc)
                    .all(&ctx.db)
                    .await?;

    format::json(ApiResponse::ok(tvs))

}

pub async fn tv(
    Path(Id): Path<i32>,
    State(ctx): State<AppContext>
) -> Result<Response> {
    let tv = TvEntity::find_by_id(Id)
        .one(&ctx.db)
        .await?;

    match tv{
       Some(tv)  => format::json(ApiResponse::ok(tv)),
       None => format::json(ApiResponse::<Vec<TvModel>>::err("TV Channel not found")),
    }
}

pub async fn series(
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let series = SeriesEntity::find()
                    .order_by(SeriesColumn::UpdatedAt,Order::Desc)
                    .all(&ctx.db)
                    .await?;
    format::json(ApiResponse::ok(series))
}

pub async fn specific_series(
    Path(imdb_id): Path<String>,
    State(ctx): State<AppContext>
) -> Result<Response> {
    let specific_series = SeriesEntity::find()
                    .filter(SeriesColumn::ImdbId.eq(imdb_id))
                    .find_with_related(SeasonEntity)
                    .all(&ctx.db)
                    .await?;
    // let season_ids = specific_series
    // .iter()
    // .map(|(_,seasons) seasons.iter().map(|s| s.id))
    // .collect();
    // let episodes = EpisodeEntity::find()
    //     .filter(EpisodeColumn::SeasonId.is_in(season_ids))
    //     .all(&ctx.db)
    //     .await?;

    if specific_series.is_empty() {
        format::json(ApiResponse::<Vec<SeriesModel>>::err("Series not found"))
    } else {
        format::json(ApiResponse::ok(specific_series))
    }

}

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/")
        .add("/", get(index))
        .add("/movies", get(movies))
        .add("/movie/{id}", get(movie))
        .add("/tvs", get(tvs))
        .add("/tv/{id}", get(tv))
        .add("/series", get(series))
        .add("/series/{id}", get(specific_series))
}