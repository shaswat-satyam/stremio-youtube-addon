use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "tvs",
            &[
                ("id", ColType::PkAuto),
                ("name", ColType::StringNull),
                ("description", ColType::StringNull),
                ("genre", ColType::StringNull),
                ("youtube_id", ColType::StringNull),
            ],
            &[],
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "tvs").await
    }
}
