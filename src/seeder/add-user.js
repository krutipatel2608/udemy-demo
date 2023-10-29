const bcrypt = require('bcrypt')

const superAdminJson = require('../json/super-admin.json')
const db = require('../model/index')
const superAdminModel = db.superAdmin

const addSuperAdmin = async() => {
    const checkSuperAdmin = await superAdminModel.findOne({ where: {id: '1'}})
    if(checkSuperAdmin){
        console.log('Super-Admin already exist');
    }else{
        const hashPassword = bcrypt.hashSync(superAdminJson.password,10)
        superAdminJson.password = hashPassword
        if(!hashPassword){
            console.log('error in password');
        }else{
           const addData=  await superAdminModel.create(superAdminJson)
           if(addData){
            console.log('Super-Admin added successfully');
           }else{
            console.log('error, Super-Admin not added');
           }
        }
    }
}

addSuperAdmin()