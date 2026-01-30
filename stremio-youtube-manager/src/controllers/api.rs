#![allow(clippy::missing_errors_doc)]
#![allow(clippy::unnecessary_struct_initialization)]
#![allow(clippy::unused_async)]
use loco_rs::prelude::*;

use sea_orm::{Order,QueryOrder};
use crate::{
    models::_entities::movies::{ Column, Entity, Model},
};
// use crate::models::episodes;
// use crate::models::seasons;
// use crate::models::series::Model;
// use crate::models::series;

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
    let movies = Entity::find()
        .order_by(Column::Id, Order::Desc)
        .all(&ctx.db)
        .await?;
    format::json(ApiResponse::ok(movies))

}

pub async fn movie(
    Path(imdb_id): Path<String>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    let movies = Entity::find()
        .filter(Column::ImdbId.eq(imdb_id))
        .all(&ctx.db)
        .await?;

    if movies.is_empty() {
        format::json(ApiResponse::<Vec<Model>>::err("Movie not found"))
    } else {
        format::json(ApiResponse::ok(movies))
    }
}

// pub async fn tvs(
//     ViewEngine(v): ViewEngine<TeraView>,
//     State(ctx): State<AppContext>
// ) -> Result<Response> {
//     let tvs = tvs::find()
//                     .order_by_desc(column::updatedate)
//                     .all(&ctx.db)
//                     .await?;
//     format::json(apiresponse::success(tvs))

// }

// pub async fn tv(
//     Path(id): Path<i32>,
//     ViewEngine(v): ViewEngine<TeraView>,
//     State(ctx): State<AppContext>
// ) -> Result<Response> {
//     let tv = tvs::find_by_id(&id)
//                     .one(&ctx.db)
//                     .await?;
//     match tv {
//         Some(tv) => format::json(apiresponse::success(tv)),
//         None => format::json(apiresponse::<Model>::error("TV Channel not found")),
//     }

// }

// pub async fn series(
//     ViewEngine(v): ViewEngine<TeraView>,
//     State(ctx): State<AppContext>,
// ) -> Result<Response> {
//     let series = series::find()
//                     .order_by_desc(column::updatedate)
//                     .all(&ctx.db)
//                     .await?;
//     format::json(apiresponse::success(series))

// }

// pub async fn specific_series(
//     Path(id): Path<i32>,
//     ViewEngine(v): ViewEngine<TeraView>,
//     State(ctx): State<AppContext>
// ) -> Result<Response> {
//     let specific_series = series::find_by_id(&id)
//                     .one(&ctx.db)
//                     .await?;
//     match specific_series {
//         Some(specific_series) => format::json(apiresponse::success(specific_series)),
//         None => format::json(apiresponse::<Model>::error("Specific Series is not found")),
//     }

// }

pub fn routes() -> Routes {
    Routes::new()
        .prefix("api/")
        .add("/", get(index))
        .add("/movies", get(movies))
        .add("/movie/{id}", get(movie))
        // .add("/tv", get(tvs))
        // .add("/tv/{id}", get(tv))
        // .add("/series", get(series))
        // .add("/series/{id}", get(specific_series))
}