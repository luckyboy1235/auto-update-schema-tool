const { Client } = require('pg')
const dotenv = require('dotenv')
dotenv.config()
//connect db, should use config from environment for development
const client = new Client({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})
const  connect = async () => {
    await client.connect()
}

const dbInitSchemaAndTables = async (client) => {
    return await client.query(`
    CREATE SCHEMA IF NOT EXISTS Account;
    CREATE TABLE IF NOT EXISTS Account.USER_TABLE (
        Id          BIGINT      GENERATED BY DEFAULT AS IDENTITY,
        Type        INT                          NULL,
        Property2   INT                          NULL,
        deleted_column   INT                          NULL
    )
`)
}

const dbDropSchemaAndTable = async (client) => {
    return await client.query(`
    DROP TABLE account.user_table;
    DROP SCHEMA account;
`)
}

const dbAlterTableEditColumn = async (client) => {
    return await client.query(`
    ALTER TABLE account.user_table
    ADD COLUMN IF NOT EXISTS new_column_1 int;
    ALTER TABLE account.user_table
    DROP COLUMN IF EXISTS deleted_column;
`)
}

const dbGetSchemas = async (client) => {
    return await client.query(`
    SELECT  T1.table_name					AS ObjectType,
            T1.table_schema					AS ObjectName,
            C1.column_name					AS ColumnName,
            C1.data_type					AS DataType,
            CASE C1.is_nullable
                WHEN 'NO' 		THEN 'NOTNULL'
                WHEN 'YES'  	THEN 'NULL'
            END 						  	AS Nullable,
            CASE is_identity
                WHEN 'YES' 		THEN CONCAT('identity(',C1.identity_start,',',C1.identity_increment,')')
            END								AS MiscInfo
    FROM information_schema.tables T1
    LEFT JOIN information_schema.columns C1
        ON C1.table_schema = T1.table_schema
    WHERE T1.table_type = 'BASE TABLE'
        AND T1.table_schema NOT IN ('pg_catalog', 'information_schema', 'public')
    ORDER BY ordinal_position
    `)
}

module.exports = { dbInitSchemaAndTables, dbGetSchemas, dbAlterTableEditColumn, connect, client, dbDropSchemaAndTable }