<template>
  <div class="md:w-2/3 xl:w-1/3 m-auto">
    <div class="py-6 text-center">
      <h1 class="text-3xl font-bold">Birthday app</h1>
      <p class="mt-4 text-2xl font-bold">Sign up for new account</p>
      <p class="mt-4 text-lg">
        Or sign in
        <nuxt-link class="hover:underline" to="/login">here</nuxt-link>
      </p>
    </div>

    <div class="bg-white shadow-md rounded p-5 md:p-8 lg:p-10">
      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="email">Name</label>
          <input id="name" v-model="name" name="name" type="text" placeholder="Name" />
        </div>

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

        <div class="mb-5 flex items-center">
          <input class="mr-2 leading-tight w-auto shadow-none border-0" type="checkbox" name="accept_terms" id="accept_terms" v-model="accept_terms" />
          <label for="accept_terms" class="text-normal m-0 font-normal">I accept the <a href="/terms" target="_blank">terms of service</a></label>
        </div>

        <div>
          <button
            class="btn btn-brand w-full"
            type="submit"
            :disabled="loading || !name || !email || !password || !accept_terms"
          >Sign up</button>
        </div>
      </form>

      <SocialLogin :register="true" />
      <Links />
    </div>
  </div>
</template>

<script>
import SocialLogin from './SocialLogin'
import Links from '~/components/shared/Links'

export default {
  components: {
    SocialLogin,
    Links
  },
  data() {
    return {
      title: 'Sign Up',
      name: '',
      email: '',
      password: '',
      accept_terms: false,
      loading: false
    }
  },
  methods: {
    async register() {
      this.loading = true

      try {
        await this.$axios.$post('/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })

        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password
          }
        })

        this.$router.push('/')
      } catch (e) {
        this.loading.false
        this.error = e.response.data.message
      }

      this.loading = false
    }
  }
}
</script>
