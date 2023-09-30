const staffController = require('../controller/staff')
// const auth = require('../middleware/auth.middleware')

module.exports = function(app, router) {
    router.post('/staff-add',staffController.add)
    router.get('/view-staff/:id', staffController.view)
    router.get('/list-staff',staffController.list)
    router.put('/edit-staff/:id',staffController.edit)
    router.delete('/delete-staff/:id',staffController.remove)
    router.post('/create-bucket', staffController.uploadToS3)

    app.use('/api', router)
}