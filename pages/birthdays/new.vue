<template>
  <BirthdayForm />
</template>

<script>
import BirthdayForm from '~/components/birthdays/BirthdayForm'

export default {
  components: {
    BirthdayForm
  },
  name: 'NewBirthday',
  head() {
    return {
      title: 'Add new birthday'
    }
  }
}
</script>
