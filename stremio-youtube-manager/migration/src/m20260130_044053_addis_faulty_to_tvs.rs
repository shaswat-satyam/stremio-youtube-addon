use sea_orm_migration::prelude::*;
use loco_rs::schema::{add_column, remove_column, ColType};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, m: &SchemaManager) -> Result<(), DbErr> {
        add_column(m, "tvs", "is_faulty", ColType::BooleanNull).await?;
        Ok(())
    }

    async fn down(&self, m: &SchemaManager) -> Result<(), DbErr> {
        remove_column(m, "tvs", "is_faulty").await?;
        Ok(())
    }
}

