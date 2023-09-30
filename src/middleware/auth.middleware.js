const { getAuth, signInWithCustomToken } = require('firebase/auth')
const admin = require('firebase-admin')

const response = require('../constant/response')

const auth = () => {
    return async function(req, res, next){
        try {
            const auth = getAuth()
            const authHeader = req.headers.authorization
            if(!authHeader || !authHeader.startsWith('Bearer')){
                return response(res, false, 401, 'Access Denied!')
            }

            const token = authHeader.replace('Bearer ','')
            const currentUser = auth.currentUser
            if(currentUser){
                const verifyToken = await admin.auth().verifyIdToken(token)
                
                if(verifyToken.uid === currentUser.uid){
                    req.user = verifyToken.user
                    return next()
                }else{
                    return response(res, false, 401, 'Invalid Token!')
                }
            }
            
        } catch (error) {
            console.log(error);
            return response(res, false, 401, 'Invalid Token!')
        }
    }
}

module.exports = auth