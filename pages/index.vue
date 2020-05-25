<template>
  <div>
    <BirthdayList />
  </div>
</template>

<script>
import BirthdayList from '~/components/birthdays/BirthdayList'

export default {
  components: {
    BirthdayList
  },
  head() {
    return {
      title: 'Birthdays'
    }
  },
  async fetch() {
    await this.$store.dispatch('birthdays/get')
  }
}
</script>
