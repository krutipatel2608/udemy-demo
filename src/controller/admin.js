const {  getAuth, signInWithEmailAndPassword } = require('firebase/auth')
const admin = require('../firebase/firebase-config')

const response = require('../constant/response')

exports.signUp = async(req, res) => {
    await admin.auth().createUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone_no
    })
    .then((result) => {
        return response(res,true, 201, 'user account created successfully!')
    })
    .catch((error) => {
        console.log(error);
        return response(res,false, 422, 'something went wrong')
    })
}

exports.signIn = async(req, res) => {
    const auth = getAuth()
    await signInWithEmailAndPassword(auth,req.body.email, req.body.password)
    .then(async(result) => {
        if(result){
            const currentUser = auth.currentUser
            const userData = currentUser.providerData   // current user specific details
            const token= await currentUser.getIdToken()
            if(token){
                const userObj = {
                    displayName: currentUser.displayName,
                    email: currentUser.email,
                    phone_no:currentUser.phone,
                    token: token
                }
                return response(res, true, 200, 'login successfully',userObj)
            }else{
                return response(res, false, 422, 'something went wrong!')
            }
         }else{
            return response(res, false, 406, 'Invalid Credentials!')
         }
    })
    .catch((error) => {
        console.log(error);
        return response(res, false, 422, 'something went wrong')
    })
}

