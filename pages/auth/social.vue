<template>
  <div class="h-screen flex justify-center items-center">
    <h1 class="text-3xl text-center">Logging you in....</h1>
  </div>
</template>

<script>
export default {
  layout: 'guest',
  auth: 'guest',
  mounted() {
    if (this.$route.query.token) {
      this.loginWithToken(this.$route.query.token)
    } else if (this.$route.query.error) {
      this.$router.push('/login')
      this.$notify({ type: 'error', title: "Sorry", text: 'Can\'t sign you in' })
    }
  },
  methods: {
    async loginWithToken(token) {
      await this.$auth
        .loginWith('local', {
          data: {
            token: token
          }
        })
        .then(() => {
          this.$router.push('/')
        })
    }
  }
}
</script>