const adminController = require('../controller/admin')

module.exports = function(app, router) {
    router.post('/sign-up', adminController.signUp)
    router.post('/sign-in', adminController.signIn)

    app.use('/api', router)
}