use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "seasons",
            &[
                ("id", ColType::PkAuto),
                ("season_number", ColType::IntegerNull),
                ("season_youtube_playlist", ColType::StringNull),
            ],
            &[("series", "")],
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "seasons").await
    }
}
