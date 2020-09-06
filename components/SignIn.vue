<template>
  <div id="firebaseui-auth-container" ref="firebaseui-auth-container"></div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebaseui/dist/firebaseui.css'

export default Vue.extend({
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
    },
    onSignOut() {
      console.log(`logout`)
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
          // google
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          // Twitter
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
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
