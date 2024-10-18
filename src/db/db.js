const mongoose = require('mongoose');
const config = require('../../config');
const host_url = config.db.mongoHostUrlMain || config.db.mongoHostUrlDev;
const connectToMongo = ()=>{
    mongoose.connect(host_url).then(()=>{
        console.log('connected to mongoose ✅');
    }).catch(()=>{
        console.log('error connecting to mongoose❌');
    })
}
module.exports = {connectToMongo};