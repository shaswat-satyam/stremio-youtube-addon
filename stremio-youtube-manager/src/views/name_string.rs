use loco_rs::prelude::*;

use crate::models::_entities::name_strings;

/// Render a list view of `name:strings`.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn list(v: &impl ViewRenderer, items: &Vec<name_strings::Model>) -> Result<Response> {
    format::render().view(v, "name_string/list.html", data!({"items": items}))
}

/// Render a single `name:string` view.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn show(v: &impl ViewRenderer, item: &name_strings::Model) -> Result<Response> {
    format::render().view(v, "name_string/show.html", data!({"item": item}))
}

/// Render a `name:string` create form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn create(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "name_string/create.html", data!({}))
}

/// Render a `name:string` edit form.
///
/// # Errors
///
/// When there is an issue with rendering the view.
pub fn edit(v: &impl ViewRenderer, item: &name_strings::Model) -> Result<Response> {
    format::render().view(v, "name_string/edit.html", data!({"item": item}))
}
