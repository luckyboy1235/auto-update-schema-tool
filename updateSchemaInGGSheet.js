
const { ggsListAllSchema, ggsUpdateSchema, ggsGetAuthorization} =  require('./google_sheet')
const { dbInitSchemaAndTables, dbGetSchemas } = require('./db')
const { formatArray, replaceData } = require('./data_handler')
const  {client} = require('./db')
const ggsUpdateSchemaInGGSheet = async () => {
    try {
        //get all tables user created
        const res = await dbGetSchemas(client)
        //format data to update to google sheet
        const db_data = formatArray(res.rows)
        // console.log(db_data)
        //get google sheet auth
        const auth = await ggsGetAuthorization()
        //get data from google sheet
        const ggs_data = (await ggsListAllSchema(auth)).data.values
        const update_data = replaceData(ggs_data, db_data)
        // console.log(update_data)
        await ggsUpdateSchema(auth, 'Db Document!A2:H', update_data)
        // console.log(JSON.stringify(data.data.values, null, 4))
        // console.log(res.rows)
    } catch (error) {
        console.log(error)
    }
}

module.exports = ggsUpdateSchemaInGGSheet