use loco_rs::prelude::*;

use crate::models::_entities::seasons;

/// Render a list view of `seasons`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<seasons::Model>) -> Result<Response> {
    format::render().view(v, "season/list.html", data!({"items": items}))
}

/// Render a single `season` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &seasons::Model) -> Result<Response> {
    format::render().view(v, "season/show.html", data!({"item": item}))
}

/// Render a `season` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "season/create.html", data!({}))
}

/// Render a `season` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &seasons::Model) -> Result<Response> {
    format::render().view(v, "season/edit.html", data!({"item": item}))
}
