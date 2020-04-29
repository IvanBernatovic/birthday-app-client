<template>
  <div>
    <div class="py-6 flex">
      <div class="bg-gray-400 relative flex-grow line"></div>
      <div class="px-5 text-gray-700">Or sign {{ register ? 'up' : 'in' }} with</div>
      <div class="bg-gray-400 relative flex-grow line"></div>
    </div>

    <div class="flex items-center justify-center">
      <button class="btn social-btn" @click="loginWith('google')">
        <fa :icon="faGoogle"></fa>
      </button>

      <button class="btn social-btn" @click="loginWith('facebook')">
        <fa :icon="faFacebookF"></fa>
      </button>
    </div>
  </div>
</template>

<style scoped>
.social-btn {
  @apply border border-gray-600 text-gray-600 text-center mr-4 text-lg;
  transition: color 0.2s ease-out;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  min-width: 7rem;

  &:last-child {
    @apply mr-0;
  }

  &:hover {
      @apply text-brand-600;
  }
}
</style>

<script>
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons'

export default {
  props: {
      register: {
          required: false,
          default: false
      }
  },
  methods: {
    loginWith(service) {
      window.location.href = `${process.env.BASE_API_URL}/auth/login/${service}`
    }
  },
  computed: {
    faGoogle() {
      return faGoogle
    },
    faFacebookF() {
      return faFacebookF
    }
  }
}
</script>