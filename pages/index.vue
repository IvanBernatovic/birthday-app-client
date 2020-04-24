<template>
  <div>
    <div class="card lg:w-2/3 mx-auto">
      <div v-if="birthdays.length">
        <h2 class="mb-2 font-bold text-lg text-purple-800">Upcoming birthdays</h2>

        <div v-for="(birthdays, month) in sorted_this_year" :key="'sty_m_'+month" class="mb-2">
          <h1 class="font-bold mb-2 text-gray-800">{{ new Date(null, month - 1) | moment('MMMM') }}</h1>
          <Birthday
            v-for="(birthday, index) in birthdays"
            :key="'sty_b_'+index"
            :birthday="birthday"
            :now="now"
            @click.native="editBirthday(birthday)"
          />
        </div>

        <div v-if="Object.keys(sorted_next_year).length" class="mt-2">
          <h2 class="font-bold mb-2 text-lg">{{ now.getFullYear() + 1 }}</h2>

          <div v-for="(birthdays, month) in sorted_next_year" :key="'sny_m_'+month" class="mb-2">
            <h1 class="font-bold text-gray-800 mb-2">{{ new Date(null, month - 1) | moment('MMMM') }}</h1>
            <Birthday
              v-for="(birthday, index) in birthdays"
              :key="'sny_b_'+index"
              :birthday="birthday"
              :now="nextYear"
              @click.native="editBirthday(birthday)"
            />
          </div>
        </div>
      </div>
      <div v-show="!birthdays.length">
        <p>
          You don't have any birthdays added, add them
          <nuxt-link class="font-bold text-purple-900" to="/birthdays/new">here</nuxt-link>
        </p>
      </div>
    </div>

    <birthday-modal :showing="modal" @close="modal = false">
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
          <p class="text-sm text-gray-500 mb-2">Here you can set specific reminders for this birthday.</p>
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
    </birthday-modal>
  </div>
</template>

<script>
import BirthdayModal from '~/components/BirthdayModal'
import Birthday from '~/components/Birthday'
import { mapState } from 'vuex'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'

export default {
  components: {
    BirthdayModal,
    Birthday
  },
  head() {
    return {
      title: 'Birthdays'
    }
  },
  data() {
    const now = new Date()
    const nextYear = new Date()
    nextYear.setFullYear(now.getFullYear() + 1)

    return {
      modal: false,
      birthday: null,
      name: '',
      date: null,
      now,
      nextYear,
      new_gift: '',
      before_amount: 1,
      before_unit: 1,
      updateLoading: false,
      giftLoading: false,
      reminderLoading: false
    }
  },
  computed: {
    birthdays() {
      return this.$store.state.birthdays.list
    },
    sorted_this_year() {
      let now = this.$moment(this.now)
      let _birthdays = this.birthdays.filter(
        birthday => birthday.day_of_year >= now.dayOfYear()
      )

      _birthdays = groupBy(_birthdays, birthday => {
        return birthday.date.getMonth() + 1
      })

      return _birthdays
    },
    sorted_next_year() {
      let now = this.$moment(this.now)
      let _birthdays = this.birthdays.filter(
        birthday => birthday.day_of_year < now.dayOfYear()
      )

      _birthdays = groupBy(_birthdays, birthday => {
        return birthday.date.getMonth() + 1
      })

      return _birthdays
    }
  },
  async fetch() {
    await this.$store.dispatch('birthdays/get')
  },
  methods: {
    editBirthday(birthday) {
      this.birthday = birthday
      this.name = birthday.name
      this.date = birthday.date

      this.modal = !this.modal
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
