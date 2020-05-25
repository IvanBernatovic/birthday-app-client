<script>
export default {
  props: {
    birthday: {
      default: {
        name: '',
        date: ''
      },
      type: Object
    },
    showing: {
      required: true,
      type: Boolean
    }
  },
  data() {
    return {
      name: '',
      date: null,
      new_gift: '',
      before_amount: 1,
      before_unit: 1,
      updateLoading: false,
      giftLoading: false,
      reminderLoading: false
    }
  },
  watch: {
    showing(value) {
      if (value) {
        return document.querySelector('body').classList.add('overflow-hidden')
      }

      document.querySelector('body').classList.remove('overflow-hidden')
    },
    birthday(birthday) {
      if (birthday) {
        this.name = birthday.name
        this.date = birthday.date
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async addGift() {
      this.giftLoading = true
      await this.$store
        .dispatch('birthdays/addGift', {
          newGift: { body: this.new_gift },
          birthday: this.birthday
        })
        .then(() => {
          this.new_gift = ''
        })

      this.giftLoading = false
    },
    async deleteGift(gift) {
      await this.$store
        .dispatch('birthdays/deleteGift', {
          gift: gift,
          birthday: this.birthday
        })
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Gift deleted'
          })
        })
    },
    async addReminder() {
      this.reminderLoading = true
      await this.$store.dispatch('birthdays/addReminder', {
        newReminder: {
          before_amount: this.before_amount,
          before_unit: this.before_unit
        },
        birthday: this.birthday
      })

      this.reminderLoading = false
    },
    async deleteReminder(reminder) {
      await this.$store
        .dispatch('birthdays/deleteReminder', {
          reminder: reminder,
          birthday: this.birthday
        })
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Reminder deleted'
          })
        })
    },
    async updateBirthday() {
      this.updateLoading = true

      await this.$store
        .dispatch('birthdays/updateBirthday', {
          ...this.birthday,
          ...{
            name: this.name,
            date: this.date
          }
        })
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Birthday updated'
          })
        })

      this.updateLoading = false
    },
    async deleteBirthday() {
      this.$store
        .dispatch('birthdays/deleteBirthday', this.birthday)
        .then(() => {
          this.$notify({
            type: 'success',
            title: 'Birthday deleted'
          })
          this.modal = false
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

<template>
  <Transition name="fade">
    <div
      v-if="showing"
      class="p-3 fixed inset-0 w-full h-screen flex items-center justify-center bg-semi-75"
      @click.self="close"
    >
      <div
        class="relative w-full max-w-2xl bg-white shadow-lg rounded-lg p-4 md:p-8 modal-body overflow-y-auto"
      >
        <button
          aria-label="close"
          class="absolute top-0 right-0 text-3xl text-gray-500 my-2 mx-4"
          @click.prevent="close"
        >×</button>
        <div class="modal-content">
          <div v-if="birthday">
            <div class="upper-form">
              <h1 class="text-lg font-bold mb-2">Edit birthday</h1>

              <form @submit.prevent="updateBirthday">
                <div class="md:flex">
                  <div class="flex-grow md:mr-3">
                    <label for="name">Name</label>
                    <input
                      id="name"
                      v-model="name"
                      class="mb-3 md:mb-0"
                      name="name"
                      type="text"
                      autocomplete="off"
                      placeholder="Name"
                    />
                  </div>
                  <div class="flex-grow">
                    <label for="date">Date</label>
                    <flat-pickr v-model="date" name="date" placeholder="Birth date" />
                  </div>
                </div>
                <div class="mt-3">
                  <button
                    :disabled="updateLoading || !name"
                    type="submit"
                    class="btn btn-brand-outline"
                  >Update</button>

                  <button @click="deleteBirthday" type="button" class="btn text-gray-800">Delete</button>
                </div>
              </form>
            </div>

            <div id="gifts-section" class="mt-8">
              <h2 class="text-lg font-bold mb-2">Gifts</h2>
              <form @submit.prevent="addGift" class="md:flex">
                <input
                  v-model="new_gift"
                  placeholder="E.g. big hairdryer or bread maker"
                  type="text"
                  name="new_gift"
                  autocomplete="off"
                  class="md:w-auto mb-3 md:mb-0 md:flex-grow md:mr-3"
                />
                <button
                  :disabled="giftLoading || !new_gift"
                  type="submit"
                  class="btn btn-brand w-full md:w-auto"
                >Add gift</button>
              </form>

              <div id="gifts" class="mt-4">
                <div
                  :key="'gift-'+g_index"
                  v-for="(gift, g_index) in birthday.gifts"
                  class="py-2 border-b border-gray-300 flex justify-between items-center last:border-b-0"
                >
                  <p>{{ gift.body }}</p>
                  <button class="btn-sm text-red-600" @click="deleteGift(gift)">Remove</button>
                </div>
              </div>
              <p
                v-if="!birthday.gifts.length"
              >You don't have gifts for this birthday, use the form above to add gifts.</p>
            </div>

            <div id="reminders-section" class="mt-8">
              <h2 class="text-lg font-bold">Reminders</h2>
              <p
                class="text-sm text-gray-500 mb-2"
              >Here you can set specific reminders for this birthday.</p>
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
                <button
                  :disabled="reminderLoading"
                  class="btn btn-brand"
                  @click="addReminder"
                >Add reminder</button>
              </div>

              <div id="reminders" class="mt-4">
                <div
                  :key="'reminder-'+r_index"
                  v-for="(reminder, r_index) in birthday.reminders"
                  class="py-2 border-b border-gray-300 flex justify-between items-center"
                >
                  <p>{{ simplifyReminder(reminder) }}</p>
                  <button class="btn-sm text-red-600" @click="deleteReminder(reminder)">Remove</button>
                </div>
              </div>
              <p v-if="!birthday.reminders.length">There are no individual reminders set.</p>
            </div>
          </div>
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
