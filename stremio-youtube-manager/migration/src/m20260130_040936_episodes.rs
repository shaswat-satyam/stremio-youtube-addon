use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "episodes",
            &[
                ("id", ColType::PkAuto),
                ("name", ColType::StringNull),
                ("youtube_id", ColType::StringUniq),
                ("episode_number", ColType::IntegerNull),
            ],
            &[("season", "")],
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "episodes").await
    }
}
