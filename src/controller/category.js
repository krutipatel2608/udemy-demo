const response = require('../constant/response')
const db = require('../model/index')
const categoryModel = db.category

exports.add = async(req, res) => {
    await categoryModel.create(req.body)
    .then((categoryData) => {
        return response(res,true ,201,'category added successfully!', categoryData)
    })
    .catch((error) => {
        return response(res,false, 201, 'error! category not added')
    })
}

exports.view = async(req, res) => {
    await categoryModel.findOne({where: {id: req.params.id}})
    .then((categoryData) => {
        if(!categoryData){
            return response(res, false, 422, 'category data not exist!')
        }
        return response(res, true, 200, 'category data found', categoryData)
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'category data not found')
    })
}

exports.list = async(req, res) => {
    await categoryModel.findAll()
    .then((categoryData) => {
        if(!categoryData.length){
            return response(res, true, 204, 'No data exists!')
        }
        return response(res, true, 200, 'Category list found', categoryData)
    })
    .catch(() => {
        return response(res, false, 422, 'Category list not found')
    })
}

exports.edit = async(req, res) => {
     await categoryModel.findOne({where: {id: req.params.id}})
    .then(async(categoryData) => {
        if(!categoryData){
            return response(res, false, false, 'data does not exist')
        }else{
         await categoryModel.update(req.body,{where: {id: req.params.id}})
         .then((updatedRecord) => {
            return response(res, true, 201, 'category data updated successfully!',req.body)
         })
         .catch((error) => {
            console.log(error, '----- error 1');
            return response(res, false, 422, 'category data not updated')
         })
        }
    })
    .catch((error) => {
        console.log(error, '----- error 2');

        return response(res, false, 422, 'category data not updated')
    })
}

exports.remove = async(req,res) => {
    await categoryModel.findOne({where: {id: req.params.id}})
    .then(async(categoryData) => {
        if(!categoryData){
            return response(res, false, false, 'data does not exist')
        }else{
         await categoryModel.destroy({where: {id: req.params.id}})
         .then(() => {
            return response(res, true, 201, 'category data deleted successfully!')
         })
         .catch((error) => {
            console.log('log 1 error-----> ',error);
            return response(res, false, 422, 'category data not deleted')
         })
        }
    })
    .catch((error) => {
        console.log('log 2 error-----> ',error);

        return response(res, false, 422, 'category data not deleted')
    })
}

