import { createClient } from '@supabase/supabase-js'
import { Sequelize } from 'sequelize'

// ============================ SUPABASE STORAGE (OBJECT)

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

// ============================ SQL STORAGE
const db_env = process.env.DB_ENV

const config = {
    name: db_env === 'development'
        ? process.env.DB_DEV_NAME
        : process.env.DB_PROD_NAME,
    host: db_env === 'development'
        ? process.env.DB_DEV_HOST
        : process.env.DB_PROD_HOST,
    user: db_env === 'development'
        ? process.env.DB_DEV_USER
        : process.env.DB_PROD_USER,
    pass: db_env === 'development'
        ? process.env.DB_DEV_PASS
        : process.env.DB_PROD_PASS,
    dialect: db_env === 'development'
        ? process.env.DB_DEV_DIALECT
        : process.env.DB_PROD_DIALECT,
    pool: db_env === 'development'
        ? process.env.DB_DEV_POOL
        : process.env.DB_PROD_POOL,
    port: db_env === 'development'
        ? process.env.DB_DEV_PORT
        : process.env.DB_PROD_PORT,
    timezone: db_env === 'development'
        ? process.env.DB_DEV_TIMEZONE
        : process.env.DB_PROD_TIMEZONE
}

export const db_config = config

const db = new Sequelize(
    config.name,
    config.user,
    config.pass,
    {
        host: config.host,
        dialect: config.dialect,
        dialectModule: config.dialect === 'mysql'
            ? require('mysql2')
            : require('pg'),
        logging: false,
        timezone: config.timezone
    }
)

console.log(`[DATABASE]: Connecting to Database`)

db.authenticate().then(() => {
    console.log(`[DATABASE]: Connected, syncing in..`)
})

db.sync({ alter: true }).then(() => {
    console.log(`[DATABASE]: Database is synced`)
})

export { db }