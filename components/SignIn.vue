<template>
  <div>
    <div
      v-show="isLogin === false"
      class="flex-center-center"
      style="width: 100vw; height: 100vh"
    >
      <div id="firebaseui-auth-container" ref="firebaseui-auth-container"></div>
    </div>
    <div v-if="isLogin !== false" class="p-2">
      <button
        class="bg-gray-800 text-gray-100 p-2 rounded-lg w-full"
        @click="logout"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebaseui/dist/firebaseui.css'

export default Vue.extend({
  data() {
    return {
      isLogin: false,
    }
  },
  async created(): Promise<void> {
    // eslint-disable-next-line promise/param-names
    const fbUser: firebase.User | null = await new Promise(
      (resolve, _reject) => {
        firebase.auth().onAuthStateChanged((user: firebase.User | null) => {
          resolve(user)
        })
      }
    )
    // this.$nuxt.$loading.finish()
    if (fbUser) this.onSignIn(fbUser)
    else this.onSignOut()
  },
  mounted() {
    // this.$nuxt.$loading.start()
    this.$nextTick(() => {
      setTimeout(() => {
        // this.$nuxt.$loading.finish()
        this.shownModal()
      }, 1000)
    })
  },
  methods: {
    onSignIn(fbUser: firebase.User) {
      console.log(`login!!!`, fbUser)
      this.isLogin = true
      this.$firestore.collection('users').doc(fbUser.uid).set({
        fbid: fbUser.uid,
        lastLoginAt: this.$firestoreServerTimestamp,
      })
    },
    onSignOut() {
      console.log(`logout`)
      this.isLogin = false
    },
    async logout() {
      await firebase.auth().signOut()
      window.location.reload(true)
    },
    shownModal() {
      const firebaseui = require('firebaseui')
      const uiConfig = {
        // ログイン完了時のリダイレクト先
        signInSuccessUrl: this.$route.fullPath, // this.signInSuccessUrl,
        // ポップアップで表示する
        signInFlow: 'popup',
        // 利用する認証機能
        signInOptions: [
          // Google
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Twitter
          // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          // Github
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccessWithAuthResult(
            authResult: { additionalUserInfo: { username: any } },
            _redirectUrl: any
          ) {
            console.log(authResult.additionalUserInfo.username)
            return true
          },
        },
      }
      const ui =
        firebaseui.auth.AuthUI.getInstance() ||
        new firebaseui.auth.AuthUI(firebase.auth())
      ui.start('#firebaseui-auth-container', uiConfig)
    },
  },
})
</script>
