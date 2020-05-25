<template>
  <div>
    <Login />
  </div>
</template>

<script>
import Login from '~/components/auth/Login'

export default {
  layout: 'guest',
  auth: 'guest',
  name: 'LoginPage',
  components: {
    Login
  },
  
  head() {
    return {
      title: 'Sign In'
    }
  },

  
}
</script>
