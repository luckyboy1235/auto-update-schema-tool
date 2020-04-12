const {formatArray, replaceData} = require('../data_handler');
var expect = require('chai').expect;

describe('#replaceData()', function() {

  context('missing or wrong data type', function() {
    it('should return 0', function() {
      expect(replaceData('test', 123)).to.equal(0)
    })
  })
  
  context('with correct data', function() {
    it('should return expect result', function() {
        const oldData = [
            ['USER_TABLE', 'dbo.Account', 'Id', 'bigint', 'NOT NULL', 'identity(1,1)=31184', '', ''],
            ['USER_TABLE', 'dbo.User', 'Role', 'bigint', 'NOT NULL', 'identity(1,1)=31184', '', ''],
            ['USER_TABLE', 'dbo.Account', 'Type', 'bigint', 'NOT NULL', '', 'Loại account 1 = standard user 2 = power user', ''],
            ['TEST_TABLE', 'dbo.Account', 'Id', 'bigint', 'NOT NULL', 'identity(1,1)=31184', '', ''],
            ['TEST_TABLE', 'dbo.Account', 'Test', 'bigint', 'NOT NULL', '', '', ''],
            ['TEST_TABLE', 'dbo.Account', 'Type', 'bigint', 'NOT NULL', '', 'Loại account 1 = standard user 2 = power user', '']
        ]
        const newData = [
            ['USER_TABLE', 'dbo.Account', 'Id', 'bigint', 'NOT NULL', 'identity(1,1)=31184'],
            ['USER_TABLE', 'dbo.Account', 'Type', 'bigint', 'NOT NULL', ''],
            ['TEST_TABLE', 'dbo.Account', 'Id', 'bigint', 'NOT NULL', 'identity(1,1)=31184'],
            ['TEST_TABLE', 'dbo.Account', 'Type', 'bigint', 'NOT NULL', ''],
            ['NEW_TABLE', 'dbo.Account', 'Type', 'bigint', 'NOT NULL', '']
        ]
        const expectData = [
            ['USER_TABLE', 'dbo.Account', 'Id', 'bigint', 'NOT NULL', 'identity(1,1)=31184', '', ''],
            ['USER_TABLE', 'dbo.Account', 'Type', 'bigint', 'NOT NULL', '', 'Loại account 1 = standard user 2 = power user', ''],
            ['TEST_TABLE', 'dbo.Account', 'Id', 'bigint', 'NOT NULL', 'identity(1,1)=31184', '', ''],
            ['TEST_TABLE', 'dbo.Account', 'Type', 'bigint', 'NOT NULL', '', 'Loại account 1 = standard user 2 = power user', ''],
            ['NEW_TABLE', 'dbo.Account', 'Type', 'bigint', 'NOT NULL', '','','']
        ]
        // console.log('data: ', replaceData(oldData, newData))
      expect(replaceData(oldData, newData)).to.eql(expectData)
    })
    
  })
  
})