<template>
  <div>
    <div class="card">
      <div v-show="birthdays.length">
        <h2 class="mb-2 font-bold text-lg">
          Upcoming birthdays
        </h2>

        <div
          v-for="(birthdays, month) in sortedThisYearBirthdays"
          :key="month"
          class="mb-2"
        >
          <h1 class="font-bold mb-2 ">
            {{ new Date(null, month - 1) | moment('MMMM') }}
          </h1>
          <Birthday
            v-for="(birthday, index) in birthdays"
            :key="index"
            :birthday="birthday"
            :now="now"
            @click.native="editBirthday(birthday)"
          ></Birthday>
        </div>

        <h2 class="font-black mb-2">{{ now.getFullYear() + 1 }}</h2>

        <div
          v-for="(birthdays, month) in sortedNextYearBirthdays"
          :key="month"
          class="mb-2"
        >
          <h1 class="font-bold mb-2">
            {{ new Date(null, month - 1) | moment('MMMM') }}
          </h1>
          <Birthday
            v-for="(birthday, index) in birthdays"
            :key="index"
            :birthday="birthday"
            :now="nextYear"
            @click.native="editBirthday(birthday)"
          ></Birthday>
        </div>
      </div>
      <div v-show="!birthdays.length">
        <p>
          You don't have any birthdays added, add them
          <nuxt-link class="font-bold text-purple-900" to="/birthdays/new"
            >here</nuxt-link
          >
        </p>
      </div>
    </div>

    <birthday-modal :showing="modal" @close="modal = false">
      <div>
        <h1 class="font-bold mb-2">Edit birthday</h1>

        <form @submit.prevent="updateBirthday">
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
            Update
          </button>

          <button
            type="button"
            class="mt-3 font-sm border rounded-full border-red-500 px-2 py-1 hover:bg-red-500 hover:text-white"
            @click="deleteBirthday"
          >
            Delete
          </button>
        </form>
      </div>
    </birthday-modal>
  </div>
</template>

<script>
import BirthdayModal from '~/components/BirthdayModal'
import Birthday from '~/components/Birthday'

const groupBy = function(arr, criteria) {
  return arr.reduce(function(obj, item) {
    // Check if the criteria is a function to run on the item or a property of it
    const key = typeof criteria === 'function' ? criteria(item) : item[criteria]

    // If the key doesn't exist yet, create it
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = []
    }

    // Push the value to the object
    obj[key].push(item)

    // Return the object to the next item in the loop
    return obj
  }, {})
}

export default {
  components: {
    BirthdayModal,
    Birthday
  },
  data() {
    const now = new Date()
    const nextYear = new Date()
    nextYear.setFullYear(now.getFullYear() + 1)

    return {
      modal: false,
      birthday: null,
      name: null,
      date: null,
      now,
      nextYear
    }
  },
  computed: {
    sortedThisYearBirthdays() {
      const _birthdays = groupBy(this.birthdays, item => {
        return new Date(item.date).getMonth() + 1
      })

      const currentMonth = this.now.getMonth() + 1
      const sortedThisYearBirthdays = {}
      Object.keys(_birthdays)
        .sort()
        .forEach(function(key) {
          if (currentMonth <= key)
            sortedThisYearBirthdays[key] = _birthdays[key]
        })

      return sortedThisYearBirthdays
    },
    sortedNextYearBirthdays() {
      const _birthdays = groupBy(this.birthdays, item => {
        return new Date(item.date).getMonth() + 1
      })

      const currentMonth = this.now.getMonth() + 1
      const sortedNextYearBirthdays = {}
      Object.keys(_birthdays)
        .sort()
        .forEach(function(key) {
          if (currentMonth > key) sortedNextYearBirthdays[key] = _birthdays[key]
        })

      return sortedNextYearBirthdays
    }
  },
  watch: {},
  async asyncData({ $axios }) {
    const { birthdays } = await $axios.$get('/birthdays')

    return {
      birthdays
    }
  },
  methods: {
    editBirthday(birthday) {
      this.birthday = birthday
      this.name = birthday.name
      this.date = birthday.date

      this.modal = !this.modal
    },
    async updateBirthday() {
      try {
        const birthday = await this.$axios.$patch(
          '/birthdays/' + this.birthday.id,
          {
            name: this.name,
            date: this.date
          }
        )

        this.birthdays.find((o, i) => {
          if (o.id === birthday.id) {
            this.birthdays.splice(i, 1, birthday)
            return true // stop searching
          }
        })

        this.modal = false
      } catch (e) {
        this.error = e.response.data.message
      }
    },
    async deleteBirthday() {
      try {
        await this.$axios.$delete('/birthdays/' + this.birthday.id)

        this.birthdays.find((o, i) => {
          if (o.id === this.birthday.id) {
            this.birthdays.splice(i, 1)
            return true // stop searching
          }
        })

        this.modal = false
      } catch (e) {
        this.error = e.response.data.message
      }
    }
  }
}
</script>
