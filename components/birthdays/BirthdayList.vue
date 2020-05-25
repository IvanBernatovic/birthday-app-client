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
            <h1
              class="font-bold text-gray-800 mb-2"
            >{{ new Date(null, month - 1) | moment('MMMM') }}</h1>
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

    <birthday-modal :showing="modal" :birthday="birthday" @close="modal = false" />
  </div>
</template>

<script>

import BirthdayModal from './BirthdayModal'
import Birthday from './Birthday'
import groupBy from 'lodash/groupBy'
import sortBy from 'lodash/sortBy'

export default {
  components: {
    BirthdayModal, Birthday
  },
  data() {
    const now = new Date()
    const nextYear = new Date()
    nextYear.setFullYear(now.getFullYear() + 1)

    return {
      modal: false,
      birthday: null,
      now,
      nextYear
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
  methods: {
    editBirthday(birthday) {
      this.birthday = birthday
      this.name = birthday.name
      this.date = birthday.date

      this.modal = !this.modal
    }
  }
}
</script>