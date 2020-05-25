<template>
  <div class="card md:w-1/2 lgw-1/3 mx-auto">
    <h1 class="font-bold mb-2">Add new birthday</h1>

    <form @submit.prevent="submitBirthday">
      <div class="lg:flex items-end">
        <div class="mb-3 lg:mr-3 lg:mb-0">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="name"
            name="name"
            type="text"
            placeholder="Name"
            autocomplete="off"
          />
        </div>
        <div class="mb-3 lg:mr-3 lg:mb-0">
          <label for="date">Date</label>
          <flat-pickr v-model="date" name="date" placeholder="Birth date" />
        </div>

        <button
          :disabled="loading || !name || !date"
          type="submit"
          class="btn btn-brand w-full lg:w-auto"
        >Add</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: '',
      date: '',
      loading: false
    }
  },
  methods: {
    async submitBirthday() {
      this.loading = true
      try {
        await this.$store
          .dispatch('birthdays/addBirthday', {
            name: this.name,
            date: this.date
          })
          .then(() => {
            this.loading = false
            this.$router.push('/')
          })
      } catch (error) {}

      this.loading = false
    }
  }
}
</script>