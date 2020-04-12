const cron = require('cron');
const ggsUpdateSchemaInGGSheet = require('./updateSchemaInGGSheet')
const {connect} = require('./db')

//connect db
connect()
.then(() => {
    console.log('App is running!')
    const job = new cron.CronJob({
    cronTime: '00 30 23 * * 0-6', // Run Jobs at 23h30 every day
    onTick: function() {
        ggsUpdateSchemaInGGSheet();
        console.log('Cron jub runing...');
    },
    start: true, 
    timeZone: 'Asia/Ho_Chi_Minh' 
    });

    job.start();

})
.catch(e => console.log(e))





