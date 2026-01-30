use async_trait::async_trait;
use loco_rs::{
    app::{AppContext, Hooks, Initializer},
    bgworker::{BackgroundWorker, Queue},
    boot::{create_app, BootResult, StartMode},
    config::Config,
    controller::AppRoutes,
    db::{self, truncate_table},
    environment::Environment,
    task::Tasks,
    Result,
};
use migration::Migrator;
use std::path::Path;
use crate::models::_entities::*;
use crate::models::{episodes,movies,tvs,seasons};

#[allow(unused_imports)]
use crate::{
    controllers, initializers, models::_entities::users, tasks, workers::downloader::DownloadWorker,
};

pub struct App;
#[async_trait]
impl Hooks for App {
    fn app_name() -> &'static str {
        env!("CARGO_CRATE_NAME")
    }

    fn app_version() -> String {
        format!(
            "{} ({})",
            env!("CARGO_PKG_VERSION"),
            option_env!("BUILD_SHA")
                .or(option_env!("GITHUB_SHA"))
                .unwrap_or("dev")
        )
    }

    async fn boot(
        mode: StartMode,
        environment: &Environment,
        config: Config,
    ) -> Result<BootResult> {
        create_app::<Self, Migrator>(mode, environment, config).await
    }

    async fn initializers(_ctx: &AppContext) -> Result<Vec<Box<dyn Initializer>>> {
        Ok(vec![Box::new(
            initializers::view_engine::ViewEngineInitializer,
        )])
    }

    fn routes(_ctx: &AppContext) -> AppRoutes {
        AppRoutes::with_default_routes() // controller routes below
            .add_route(controllers::api::routes())
            .add_route(controllers::episode::routes())
            .add_route(controllers::season::routes())
            .add_route(controllers::series::routes())
            .add_route(controllers::home::routes())
            .add_route(controllers::movie::routes())
            .add_route(controllers::tv::routes())
            .add_route(controllers::auth::routes())
    }
    async fn connect_workers(ctx: &AppContext, queue: &Queue) -> Result<()> {
        queue.register(DownloadWorker::build(ctx)).await?;
        Ok(())
    }

    #[allow(unused_variables)]
    fn register_tasks(tasks: &mut Tasks) {
        // tasks-inject (do not remove)
    }
    async fn truncate(ctx: &AppContext) -> Result<()> {
        truncate_table(&ctx.db, users::Entity).await?;
        Ok(())
    }
    async fn seed(ctx: &AppContext, base: &Path) -> Result<()> {
        db::seed::<users::ActiveModel>(&ctx.db, &base.join("users.yaml").display().to_string()).await?;
        db::seed::<movies::ActiveModel>(&ctx.db, &base.join("movies.yaml").display().to_string()).await?;
        db::seed::<tvs::ActiveModel>(&ctx.db, &base.join("tvs.yaml").display().to_string()).await?;
        db::seed::<series::ActiveModel>(&ctx.db, &base.join("series.yaml").display().to_string()).await?;
        db::seed::<seasons::ActiveModel>(&ctx.db, &base.join("seasons.yaml").display().to_string()).await?;
        db::seed::<episodes::ActiveModel>(&ctx.db, &base.join("episodes.yaml").display().to_string()).await?;
        Ok(())
    }
}
