<template>
  <div>
    <div class="bg-white p-4 shadow-lg">
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
        <div
          v-for="(birthday, index) in birthdays"
          :key="index"
          class="py-2 px-1 -m-1 cursor-pointer hover:bg-gray-300"
          @click="editBirthday(birthday)"
        >
          <h1>
            {{ birthday.date | moment('DD.MM.') }} - {{ birthday.name }}
            <span class="font-thin text-gray-600"
              >({{
                birthday.date
                  | moment(
                    'from',
                    new Date(birthday.date).setFullYear(now.getFullYear()),
                    true
                  )
              }})</span
            >
          </h1>
        </div>
      </div>

      <h2 class="font-black mb-2">{{ now.getFullYear() + 1 }}</h2>

      <div
        v-for="(birthdays, month) in sortedNextYearBirthdays"
        :key="month"
        class="mb-4"
      >
        <h1 class="font-bold">
          {{ new Date(null, month - 1) | moment('MMMM') }}
        </h1>
        <div v-for="(birthday, index) in birthdays" :key="index" class="mb-2">
          <h1>
            {{ birthday.date | moment('DD.MM.') }} - {{ birthday.name }}
            <span class="font-thin text-gray-600"
              >({{
                birthday.date
                  | moment(
                    'from',
                    new Date(birthday.date).setFullYear(now.getFullYear() + 1),
                    true
                  )
              }})</span
            >
          </h1>
        </div>
      </div>
    </div>

    <birthday-modal :showing="modal" @close="modal = false"></birthday-modal>
  </div>
</template>

<script>
import BirthdayModal from '~/components/BirthdayModal'

const groupBy = function(arr, criteria) {
  return arr.reduce(function(obj, item) {
    // Check if the criteria is a function to run on the item or a property of it
    const key = typeof criteria === 'function' ? criteria(item) : item[criteria]

    // If the key doesn't exist yet, create it
    if (!obj.hasOwnProperty(key)) {
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
    BirthdayModal
  },
  data() {
    return {
      modal: false
    }
  },
  async asyncData({ $axios }) {
    let { birthdays } = await $axios.$get('/birthdays')
    birthdays = groupBy(birthdays, item => {
      return new Date(item.date).getMonth() + 1
    })

    const now = new Date()
    const currentMonth = now.getMonth() + 1

    const sortedThisYearBirthdays = {}
    Object.keys(birthdays)
      .sort()
      .forEach(function(key) {
        if (currentMonth <= key) sortedThisYearBirthdays[key] = birthdays[key]
      })

    const sortedNextYearBirthdays = {}
    Object.keys(birthdays)
      .sort()
      .forEach(function(key) {
        if (currentMonth > key) sortedNextYearBirthdays[key] = birthdays[key]
      })

    return {
      now,
      sortedThisYearBirthdays,
      sortedNextYearBirthdays
    }
  },
  methods: {
    editBirthday(birthday) {
      // eslint-disable-next-line no-console
      console.log(birthday)

      this.modal = !this.modal
    }
  }
}
</script>
