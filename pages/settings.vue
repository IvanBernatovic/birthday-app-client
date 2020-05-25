<template>
  <div>
    <Settings :reminders="reminders" />
  </div>
</template>

<script>
import Settings from '~/components/settings/Settings'

export default {
  components: {
    Settings
  },
  head() {
    return {
      title: 'Settings'
    }
  },
  data() {
    return {
      reminders: [],
    }
  },
  async fetch() {
    const data = await this.$axios.$get('/reminders')
    this.reminders = data.reminders
  }
}
</script>