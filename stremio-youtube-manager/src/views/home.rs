use loco_rs::prelude::*;
use serde_json::json;

pub fn index(v: &impl ViewRenderer) -> Result<Response> {
    format::render().view(v, "home/index.html", json!({}))
}
