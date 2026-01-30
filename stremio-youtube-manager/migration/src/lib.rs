#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;
mod m20220101_000001_users;

mod m20260129_184439_tvs;
mod m20260129_190449_movies;
mod m20260130_035707_series;
mod m20260130_040057_seasons;
mod m20260130_040502_name_strings;
mod m20260130_040936_episodes;
mod m20260130_043022_add_is_faulty_to_movies;
mod m20260130_044053_addis_faulty_to_tvs;
mod m20260130_045144_addis_faulty_to_episodes;
pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20260129_184439_tvs::Migration),
            Box::new(m20260129_190449_movies::Migration),
            Box::new(m20260130_035707_series::Migration),
            Box::new(m20260130_040057_seasons::Migration),
            Box::new(m20260130_040502_name_strings::Migration),
            Box::new(m20260130_040936_episodes::Migration),
            Box::new(m20260130_043022_add_is_faulty_to_movies::Migration),
            Box::new(m20260130_044053_addis_faulty_to_tvs::Migration),
            Box::new(m20260130_045144_addis_faulty_to_episodes::Migration),
            // inject-above (do not remove this comment)
        ]
    }
}