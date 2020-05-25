<template>
  <Register />
</template>

<script>
import Register from '~/components/auth/Register'

export default {
  layout: 'guest',
  auth: 'guest',
  name: 'RegisterPage',
  components: {
    Register
  },
  head() {
    return {
      title: 'Sign Up'
    }
  }
}
</script>
