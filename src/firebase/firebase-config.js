const { initializeApp } = require('firebase/app')
const admin = require('firebase-admin')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})





  const app = initializeApp(firebaseConfig);

  module.exports = admin
