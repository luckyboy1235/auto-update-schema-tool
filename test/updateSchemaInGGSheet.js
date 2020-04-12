const ggsUpdateSchemaInGGSheet = require('../updateSchemaInGGSheet');
const {ggsGetAuthorization, ggsListAllSchema, ggsUpdateSchema} = require('../google_sheet')
const {formatArray, replaceData} = require('../data_handler');
const {dbInitSchemaAndTables, dbAlterTableEditColumn, dbDropSchemaAndTable, dbGetSchemas, client, connect} = require('../db')
var expect = require('chai').expect;

describe('#ggsUpdateSchemaInGGSheet()', function() {
    let auth
    this.timeout(10000);
    const ggs_data_init = [
        [
          'user_table',
          'account',
          'id',
          'bigint',
          'NOTNULL',
          'identity(1,1)',
          '',
          ''
        ],
        [ 'user_table', 'account', 'type', 'integer', 'NULL', '', 'Loại account 1 = standard user 2 = power user' ],
        [ 'user_table', 'account', 'init_property', 'integer', 'NULL', '', '', '' ],
        [ 'user_table', 'account', 'deleted_column', 'integer', 'NULL', '', 'with description', '' ]
      ]
    before(async () => {
        await connect()
        await dbInitSchemaAndTables(client)
        auth = await ggsGetAuthorization()
        await ggsUpdateSchema(auth, 'Db Document!A2:H', ggs_data_init)
    })
    
    it('should return schema before update', async function() {
            const db_data = await dbGetSchemas(client)
            const result = formatArray(db_data.rows)
            const expect_result = [
                [
                  'user_table',
                  'account',
                  'id',
                  'bigint',
                  'NOTNULL',
                  'identity(1,1)'
                ],
                [ 'user_table', 'account', 'type', 'integer', 'NULL', null ],
                [ 'user_table', 'account', 'property2', 'integer', 'NULL', null ],
                [ 'user_table', 'account', 'deleted_column', 'integer', 'NULL', null ],
              ]
            expect(result).to.eql(expect_result)
    })

    it('should return schema after update', async function() {
        this.timeout(10000);
        await dbAlterTableEditColumn(client)
        await ggsUpdateSchemaInGGSheet()
        await sleep(1000)
        const temp = await ggsListAllSchema(auth)
        const db_data = temp.data.values
        // console.log(temp)
        const expect_result = [
            [
              'user_table',
              'account',
              'id',
              'bigint',
              'NOTNULL',
              'identity(1,1)'
            ],
            [ 'user_table', 'account', 'type', 'integer', 'NULL', '', 'Loại account 1 = standard user 2 = power user' ],
            [
              'user_table',
              'account',
              'property2',
              'integer',
              'NULL'
            ],
            [ 'user_table', 'account', 'new_column_1', 'integer', 'NULL' ]
          ]
        expect(db_data).to.eql(expect_result)
})
    after(async () => {
        await dbDropSchemaAndTable(client)
        await ggsUpdateSchema(auth, 'Db Document!A2:H', ggs_data_init)
        await client.end()
      })
    
})

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }