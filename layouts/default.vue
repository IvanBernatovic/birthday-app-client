<template>
  <div>
    <nav class="bg-brand">
      <div
        class="flex items-center justify-between flex-wrap p-4 container mx-auto"
      >
        <nuxt-link
          to="/"
          class="flex items-center flex-shrink-0 text-white mr-6"
        >
          <span class="font-semibold text-xl tracking-tight">Birthdays</span>
        </nuxt-link>
        <div class="block md:hidden">
          <button
            class="flex items-center px-3 py-2 border rounded text-white border-white hover:text-white hover:border-white"
            @click="toggleNav"
          >
            <svg
              class="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div
          :class="open ? 'block' : 'hidden'"
          class="w-full block flex-grow md:flex md:items-center md:w-auto"
        >
          <div class="text-sm md:flex-grow">
            <nuxt-link
              to="/"
              class="block mt-4 md:inline-block md:mt-0 text-white mr-4"
            >
              Home
            </nuxt-link>

            <nuxt-link
              to="/birthdays/new"
              class="block mt-4 md:inline-block md:mt-0 text-white mr-4"
            >
              Add birthday
            </nuxt-link>
          </div>
          <div>
            <nuxt-link
              v-if="!$auth.loggedIn"
              to="register"
              class="block mt-4 md:inline-block md:mt-0 text-white hover:text-underline md:mr-3"
            >
              Register
            </nuxt-link>
            <nuxt-link
              v-if="!$auth.loggedIn"
              to="login"
              href="#responsive-header"
              class="block mt-4 md:inline-block md:mt-0 text-white hover:text-underline"
            >
              Login
            </nuxt-link>
            <span
              v-if="$auth.loggedIn"
              class="block mt-4 md:inline-block md:mt-0 text-white cursor-pointer"
              @click="logout"
            >
              Logout
            </span>
          </div>
        </div>
      </div>
    </nav>
    <div class="container mx-auto p-3 lg:p-6">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false
    }
  },
  methods: {
    toggleNav() {
      this.open = !this.open
    },
    logout() {
      this.$auth.logout()
      this.$router.push('/login')
    }
  }
}
</script>
