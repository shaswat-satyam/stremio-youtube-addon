use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "name_strings",
            &[
                ("id", ColType::PkAuto),
                ("youtube_id", ColType::StringUniq),
                ("episode_number", ColType::IntegerNull),
                ("name", ColType::StringNull),
            ],
            &[("season", "")],
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "name_strings").await
    }
}
