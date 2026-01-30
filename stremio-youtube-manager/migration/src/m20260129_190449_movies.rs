use loco_rs::schema::*;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        create_table(
            m,
            "movies",
            &[
                ("id", ColType::PkAuto),
                ("youtube_id", ColType::StringNull),
                ("imdb_id", ColType::StringNull),
                ("name", ColType::StringNull),
                ("actors", ColType::StringNull),
                ("images", ColType::StringNull),
                ("is_faulty", ColType::BooleanNull),
                ("genre", ColType::TextNull),
                ("description", ColType::StringNull),
            ],
            &[],
        )
        .await
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        drop_table(m, "movies").await
    }
}
