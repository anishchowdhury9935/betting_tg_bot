const mongoose = require('mongoose');
const config = require('../../config');
const host_url = config.devMode ? config.db.mongoConnectionUrl_dev : config.db.mongoConnectionUrl_main;
const connectToMongo = () => {
    mongoose.connect(host_url).then(() => {
        console.log('connected to mongoose ✅');
    }).catch(() => {
        console.log('error connecting to mongoose❌');
    })
}
module.exports = connectToMongo;