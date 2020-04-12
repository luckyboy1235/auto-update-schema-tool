
const replaceData = (oldData, newData) => {
    if(Array.isArray(newData) && Array.isArray(oldData) && newData.length && oldData.length) {
        const result = newData.map(db_row => {
            //if data existed, add 2 last collumn to result
            const oldRow = oldData.find(gg_row => db_row[0] === gg_row[0] && db_row[1] === gg_row[1] && db_row[2] === gg_row[2])
            if(oldRow) {
                db_row.push(oldRow[6])
                db_row.push(oldRow[7])
            }
            else {
                db_row.push('')
                db_row.push('')
            }
            return db_row
        })
        return result
    }
    console.log('Missing or wrong data type')
    return 0
}

const formatArray = (arr) => {
   return arr.map(data => Object.values(data).map(value => value ? value.toString() : value))
}

module.exports = {replaceData, formatArray}