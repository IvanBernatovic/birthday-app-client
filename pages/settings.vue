<template>
  <div>
    <div class="card lg:w-2/3 mx-auto">
      <h2 class="text-lg font-bold">Settings</h2>

      <form class="pt-4" @submit.prevent="updateUser">
        <div class="input-grou mb-3">
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

        <button :disabled="updateLoading || !name" type="submit" class="btn btn-brand w-full md:w-auto">Update</button>
      </form>

      <div class="pt-6 pb-4">
        <h2 class="text-lg font-bold">Global reminders</h2>

        <div id="reminders-section" class="pt-4">
          <div class="md:flex items-baseline">
            <input
              type="number"
              class="w-16 mr-3"
              name="before_amount"
              min="0"
              max="30"
              v-model="before_amount"
            />
            <select
              style="width: 90px"
              class="mr-3"
              name="before_unit"
              id="before-unit"
              v-model="before_unit"
            >
              <option value="1">Days</option>
              <option value="2">Weeks</option>
            </select>
            <span>before</span>
          </div>

          <div class="mt-3">
            <button :disabled="reminderLoading" class="btn btn-brand w-full lg:w-auto" @click="addReminder">Add reminder</button>
          </div>

          <div id="reminders" class="pt-2">
            <div id="reminders" class="mt-4">
              <div
                :key="'reminder-'+r_index"
                v-for="(reminder, r_index) in reminders"
                class="py-2 border-b border-gray-300 flex justify-between items-center"
              >
                <p>{{ simplifyReminder(reminder) }}</p>
                <button class="btn-sm text-red-600" @click="deleteReminder(reminder)">Remove</button>
              </div>
            </div>
            <p v-if="!reminders.length">There are no global reminders set.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import findItem from '~/misc/utilities'

export default {
  head() {
    return {
      title: 'Settings'
    }
  },
  data() {
    return {
      name: this.$store.state.auth.user.name,
      updatingProfile: false,
      before_amount: 1,
      before_unit: 1,
      reminders: [],
      updateLoading: false,
      reminderLoading: false
    }
  },
  async fetch() {
    const data = await this.$axios.$get('/reminders')
    this.reminders = data.reminders
  },
  methods: {
    async updateUser() {
      this.updateLoading = true

      const payload = {
        name: this.name
      }

      await this.$axios.patch('me', payload).then(() => {
        this.$notify({
          type: 'success',
          title: 'Updated'
        })
      })

      await this.$auth.fetchUser()
      this.updateLoading = false
    },
    async addReminder() {
      this.reminderLoading = true
      const reminder = await this.$axios.$post('reminders', {
        before_amount: this.before_amount,
        before_unit: this.before_unit
      })

      this.reminders.push(reminder)
      this.reminderLoading = false
    },
    async deleteReminder(reminder) {
      await this.$axios.$delete('reminders/' + reminder.id)
      this.reminders.splice(this.reminders.indexOf(reminder), 1)
      this.$notify({
        type: 'success',
        title: 'Reminder deleted'
      })
    },
    simplifyReminder(reminder) {
      if (reminder.before_amount == 0) {
        return 'On birthday'
      }

      let unit = reminder.before_unit == 1 ? 'days' : 'weeks'

      return reminder.before_amount + ' ' + unit + ' before'
    }
  }
}
</script>