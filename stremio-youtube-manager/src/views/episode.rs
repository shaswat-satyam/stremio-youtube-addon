use loco_rs::prelude::*;

use crate::models::_entities::episodes;

/// Render a list view of `episodes`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<episodes::Model>) -> Result<Response> {
    format::render().view(v, "episode/list.html", data!({"items": items}))
}

/// Render a single `episode` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &episodes::Model) -> Result<Response> {
    format::render().view(v, "episode/show.html", data!({"item": item}))
}

/// Render a `episode` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "episode/create.html", data!({}))
}

/// Render a `episode` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &episodes::Model) -> Result<Response> {
    format::render().view(v, "episode/edit.html", data!({"item": item}))
}
