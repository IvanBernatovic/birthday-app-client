<template>
  <div class="md:w-2/3 xl:w-1/3 m-auto">
    <div class="py-6 text-center">
      <h1 class="text-3xl font-bold">Birthday app</h1>
      <p class="mt-4 text-2xl font-bold">Sign in to your account</p>
      <p class="mt-4 text-lg">
        Or sign up
        <nuxt-link class="hover:underline" to="/register">here</nuxt-link>
      </p>
    </div>

    <div class="bg-white shadow-md rounded p-5 md:p-8 lg:p-10">
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email">Email</label>
          <input id="email" v-model="email" name="email" type="text" placeholder="Email" />
        </div>
        <div class="mb-6">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            name="password"
            type="password"
            placeholder="******************"
          />
        </div>
        <div>
          <button
            :disabled="loading || !email || !password"
            class="btn btn-brand w-full"
            type="submit"
          >Sign In</button>
        </div>
      </form>

      <SocialLogin />
      <Links />
    </div>
  </div>
</template>

<style>
.line {
  height: 1px;
  position: relative;
  top: 0.7rem;
}
</style>

<script>
import SocialLogin from './SocialLogin'
import Links from '~/components/shared/Links'

export default {
  components: {
    SocialLogin, Links
  },
  data() {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async login() {
      try {
        this.loading = true

        await this.$auth
          .loginWith('local', {
            data: {
              email: this.email,
              password: this.password
            }
          })
          .then(() => {
            this.$router.push('/')
            this.loading = false
          })

        this.loading = false
      } catch (e) {
        this.error = e.response.data.message
        this.loading = false
      }
    }
  }
}
</script>
