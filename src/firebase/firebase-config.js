const { initializeApp } = require('firebase/app')
const admin = require('firebase-admin')
const serviceAccount = require('../json/udemy-demo-5ab07-firebase-adminsdk-u1u0j-bb016914d1.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})


const firebaseConfig = {
    apiKey: "AIzaSyDrMshd-mV5CwMrV0IV48olDKUsKDYkGz8",
    authDomain: "udemy-demo-5ab07.firebaseapp.com",
    projectId: "udemy-demo-5ab07",
    storageBucket: "udemy-demo-5ab07.appspot.com",
    messagingSenderId: "558727106343",
    appId: "1:558727106343:web:ebb69f2622f0c8b2c46302",
    measurementId: "G-470DFL6CZ4"
  };


  const app = initializeApp(firebaseConfig);

  module.exports = admin