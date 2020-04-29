<template>
  <div>
    <notifications position="top right" classes="my-notification" />
    <div class="hidden">
      <a href></a>
    </div>

    <div class="app-content">
      <nav class="bg-white font-semibold text-black">
        <div class="flex items-center justify-between flex-wrap p-3 lg:p-5 container mx-auto">
          <nuxt-link to="/" class="flex items-center flex-shrink-0 mr-6">
            <span class="font-semibold text-xl tracking-tight">Birthdays</span>
          </nuxt-link>
          <div class="block md:hidden">
            <button
              class="flex items-center px-3 py-2 border outline-none rounded text-black border-black hover:text-brand-500 hover:border-black"
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
            class="w-full block flex-grow md:flex md:items-center md:w-auto text-sm"
          >
            <div class="md:flex-grow">
              <nuxt-link
                to="/birthdays/new"
                class="block mt-4 md:inline-block md:mt-0 mr-4 text-black"
              >Add birthday</nuxt-link>
            </div>
            <div>
              <nuxt-link
                to="/settings"
                class="block mt-4 mr-4 md:inline-block text-black md:mt-0 hover:text-underline"
              >Settings</nuxt-link>
              <span class="block mt-4 md:inline-block md:mt-0 cursor-pointer" @click="logout">Logout</span>
            </div>
          </div>
        </div>
      </nav>

      <div class="container mx-auto p-3 lg:p-5">
        <nuxt />
      </div>
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
  watch: {
    $route: function() {
      this.open = false
    }
  },
  methods: {
    toggleNav() {
      this.open = !this.open
    },
    logout() {
      this.$auth.logout().then(() => {
        this.$router.push('/login')
        this.$store.dispatch('reset')
      })
    }
  }
}
</script>
