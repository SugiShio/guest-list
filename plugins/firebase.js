import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyClDtBZzngVHxOIqI6LlmLaTWN087gfPZ8',
    authDomain: 'guest-list-b7dcc.firebaseapp.com',
    databaseURL: 'https://guest-list-b7dcc.firebaseio.com',
    projectId: 'guest-list-b7dcc',
    storageBucket: 'guest-list-b7dcc.appspot.com',
    messagingSenderId: '831252620962',
    appId: '1:831252620962:web:45e9d20b7945ae1745d9fb',
    measurementId: 'G-N2NQNHZV8C'
  })
}

export default firebase
export const auth = firebase.auth()
export const firestore = firebase.firestore()
