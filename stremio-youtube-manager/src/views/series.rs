use loco_rs::prelude::*;

use crate::models::_entities::series;

/// Render a list view of `series`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<series::Model>) -> Result<Response> {
    format::render().view(v, "series/list.html", data!({"items": items}))
}

/// Render a single `series` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &series::Model) -> Result<Response> {
    format::render().view(v, "series/show.html", data!({"item": item}))
}

/// Render a `series` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "series/create.html", data!({}))
}

/// Render a `series` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &series::Model) -> Result<Response> {
    format::render().view(v, "series/edit.html", data!({"item": item}))
}
