import { Plugin } from '@nuxt/types'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
}

declare module 'vue/types/vue' {
  interface Vue {
    $authFunc: Function
    $auth: firebase.auth.Auth
    $firestoreFunc: Function
    $firestore: firebase.firestore.Firestore
    $firestoreServerTimestamp: firebase.firestore.FieldValue
    $firestoreIncrement: Function
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $authFunc: Function
    $auth: firebase.auth.Auth
    $firestoreFunc: Function
    $firestore: firebase.firestore.Firestore
    $firestoreServerTimestamp: firebase.firestore.FieldValue
    $firestoreIncrement: Function
  }
  interface Context {
    $authFunc: Function
    $auth: firebase.auth.Auth
    $firestoreFunc: Function
    $firestore: firebase.firestore.Firestore
    $firestoreServerTimestamp: firebase.firestore.FieldValue
    $firestoreIncrement: Function
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $authFunc: Function
    $auth: firebase.auth.Auth
    $firestoreFunc: Function
    $firestore: firebase.firestore.Firestore
    $firestoreServerTimestamp: firebase.firestore.FieldValue
    $firestoreIncrement: Function
  }
}

const plugin: Plugin = (_context, inject) => {
  if (!firebase.apps.length) {
    // 最初だけFirebaseを使うためにinitializeAppしてinject
    firebase.initializeApp(firebaseConfig)
  }
  inject('authFunc', firebase.auth)
  inject('auth', firebase.auth())
  inject('firestoreFunc', firebase.firestore)
  inject('firestore', firebase.firestore())
  inject('firestoreIncrement', firebase.firestore.FieldValue.increment)
  inject(
    'firestoreServerTimestamp',
    firebase.firestore.FieldValue.serverTimestamp()
  )
  // context.$authFunc = firebase.auth
  // context.$auth = firebase.auth()
  // context.$firestoreFunc = firebase.firestore
  // context.$firestore = firebase.firestore()
  // context.$firestoreIncrement = firebase.firestore.FieldValue.increment
  // context.$firestoreServerTimestamp = firebase.firestore.FieldValue.serverTimestamp()
}

export default plugin
