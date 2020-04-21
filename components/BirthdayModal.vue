<script>
export default {
  props: {
    showing: {
      required: true,
      type: Boolean
    }
  },
  watch: {
    showing(value) {
      if (value) {
        return document.querySelector('body').classList.add('overflow-hidden')
      }

      document.querySelector('body').classList.remove('overflow-hidden')
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <Transition name="fade">
    <div
      v-if="showing"
      class="p-3 fixed inset-0 w-full h-screen flex items-center justify-center bg-semi-75"
      @click.self="close"
    >
      <div class="relative w-full max-w-2xl bg-white shadow-lg rounded-lg p-4 md:p-8 modal-body overflow-y-auto">
        <button
          aria-label="close"
          class="absolute top-0 right-0 text-3xl text-gray-500 my-2 mx-4"
          @click.prevent="close"
        >×</button>
        <div class="modal-content">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.modal-body {
  max-height: calc(100vh - 80px);
}
</style>
