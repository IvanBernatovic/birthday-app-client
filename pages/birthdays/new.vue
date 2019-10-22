<template>
  <div class="card">
    <h1 class="font-bold mb-2">Add new birthday</h1>

    <form @submit.prevent="submitBirthday">
      <input
        id="name"
        v-model="name"
        name="name"
        type="text"
        placeholder="Name"
      />
      <flat-pickr
        v-model="date"
        name="date"
        placeholder="Birth date"
      ></flat-pickr>
      <button
        type="submit"
        class="border border-brand rounded-full px-3 py-2 hover:bg-brand hover:text-white"
      >
        Add
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'NewBirthday',
  data() {
    return {
      name: '',
      date: ''
    }
  },
  methods: {
    async submitBirthday() {
      try {
        await this.$axios.$post('/birthdays', {
          name: this.name,
          date: this.date
        })

        this.$router.push({
          path: '/'
        })
      } catch (e) {
        this.error = e.response.data.message
      }
    }
  }
}
</script>
