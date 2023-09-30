const db = require('../model/index')
const subcategoryModel = db.subcategory
const categoryModel = db.category
const response = require('../constant/response')

exports.add = async(req, res) => {
    await subcategoryModel.create(req.body)
    .then((subcategoryData) => {
        return response(res,true ,201,'subcategory added successfully!', subcategoryData)
    })
    .catch((error) => {
        return response(res,false, 201, 'error! subcategory not added')
    })
}

exports.view = async(req, res) => {
    await subcategoryModel.findOne({
        where: {id: req.params.id},
        include:[
            {
                model: categoryModel
            }
        ]
    })
    .then((subcategoryData) => {
        if(!subcategoryData){
            return response(res, false, 422, 'subcategory data not exist!')
        }
        return response(res, true, 200, 'subcategory data found', subcategoryData)
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'subcategory data not found')
    })
}

exports.list = async(req, res) => {
    await subcategoryModel.findAll()
    .then((subcategoryData) => {
        if(!subcategoryData.length){
            return response(res, true, 204, 'No data exists!')
        }
        return response(res, true, 200, 'subcategory list found', subcategoryData)
    })
    .catch(() => {
        return response(res, false, 422, 'subcategory list not found')
    })
}

// subcategory data by category wise
exports.subcategoryBycat = async(req, res) => {
    await categoryModel.findOne({ 
        where: {id: req.params.category_id},
        include: [
            {
                model: subcategoryModel,
                attributes:[
                    "id",
                    "subcategory_name"
                ]
            }
        ]
    })
    .then((categoryResult) => {
        if(!categoryResult){
            return response(res, false, 202, 'category does not exist')
        }else{
            return response(res, true, 200, 'category data found',categoryResult)
        }
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'error, category not found')
    })
   }

   exports.edit = async(req, res) => {
    await subcategoryModel.findOne({where: {id: req.params.id}})
   .then(async(subcategoryData) => {
       if(!subcategoryData){
           return response(res, false, false, 'data does not exist')
       }else{
        await subcategoryModel.update(req.body,{where: {id: req.params.id}})
        .then((updatedRecord) => {
           return response(res, true, 201, 'subcategory data updated successfully!',req.body)
        })
        .catch((error) => {
           console.log(error, '----- error 1');
           return response(res, false, 422, 'subcategory data not updated')
        })
       }
   })
   .catch((error) => {
       console.log(error, '----- error 2');

       return response(res, false, 422, 'subcategory data not updated')
   })
}

exports.remove = async(req,res) => {
    await subcategoryModel.findOne({where: {id: req.params.id}})
    .then(async(subcategoryData) => {
        if(!subcategoryData){
            return response(res, false, false, 'data does not exist')
        }else{
         await subcategoryModel.destroy({where: {id: req.params.id}})
         .then(() => {
            return response(res, true, 201, 'subcategory data deleted successfully!')
         })
         .catch((error) => {
            console.log('log 1 error-----> ',error);
            return response(res, false, 422, 'subcategory data not deleted')
         })
        }
    })
    .catch((error) => {
        console.log('log 2 error-----> ',error);

        return response(res, false, 422, 'subcategory data not deleted')
    })
}

