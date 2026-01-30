use loco_rs::prelude::*;

use crate::models::_entities::tvs;

/// Render a list view of `tvs`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<tvs::Model>) -> Result<Response> {
    format::render().view(v, "tv/list.html", data!({"items": items}))
}

/// Render a single `tv` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &tvs::Model) -> Result<Response> {
    format::render().view(v, "tv/show.html", data!({"item": item}))
}

/// Render a `tv` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "tv/create.html", data!({}))
}

/// Render a `tv` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &tvs::Model) -> Result<Response> {
    format::render().view(v, "tv/edit.html", data!({"item": item}))
}
