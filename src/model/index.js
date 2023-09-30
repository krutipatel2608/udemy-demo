const { dbConnection, Sequelize } = require('../db-config/index')

const db = {}

db.sequelize = dbConnection
db.Sequelize = Sequelize

db.category = require('./category')(dbConnection, Sequelize)
db.subcategory = require('./subcategory')(dbConnection, Sequelize)
db.staff = require('./staff')(dbConnection, Sequelize)

Object.keys(db).forEach(modelName => {
    if('associate'in db[modelName]){
        db[modelName].associate(db)
    }
}) 

module.exports = db