import Vue from 'vue'

export let initial = {
    list: [],
    loaded: false
}

export const state = () => initial

export const mutations = {
    reset(state) {
        Object.assign(state, initial)
    },
    set(state, birthdays) {
        let _birthdays = birthdays.map((birthday) => {
            birthday.date = new Date(birthday.date)
            birthday.day_of_year = Vue.moment(birthday.date).dayOfYear()
            return birthday
        }).sort((a, b) => a.day_of_year - b.day_of_year)

        state.list = _birthdays
        state.loaded = true
    },
    add(state, birthday) {
        birthday.date = new Date(birthday.date)
        birthday.day_of_year = Vue.moment(birthday.date).dayOfYear()
        state.list.push(birthday)
    },
    update(state, updatedBirthday) {
        const birthdayIndex = findItem(state.list, updatedBirthday)
        updatedBirthday.date = new Date(updatedBirthday.date)
        updatedBirthday.day_of_year = Vue.moment(updatedBirthday.date).dayOfYear()

        // proper way to update object in array to trigger vue reactivity
        state.list.splice(birthdayIndex, 1, updatedBirthday)
    },
    remove(state, birthday) {
        state.list.splice(state.list.indexOf(birthday), 1)
    },
    addGift(state, { birthday, gift }) {
        const birthdayIndex = findItem(state.list, birthday)

        let updatedBirthday = state.list[birthdayIndex]
        updatedBirthday.gifts.push(gift)
        state.list.splice(birthdayIndex, 1, updatedBirthday)
    },
    deleteGift(state, { birthday, gift }) {
        const birthdayIndex = findItem(state.list, birthday)
        let updatedBirthday = state.list[birthdayIndex]
        const giftIndex = findItem(updatedBirthday.gifts, gift)
        updatedBirthday.gifts.splice(giftIndex, 1)
        state.list.splice(birthdayIndex, 1, updatedBirthday)
    },
    addReminder(state, { birthday, reminder }) {
        const birthdayIndex = findItem(state.list, birthday)

        let updatedBirthday = state.list[birthdayIndex]
        updatedBirthday.reminders.push(reminder)
        state.list.splice(birthdayIndex, 1, updatedBirthday)
    },
    deleteReminder(state, { birthday, reminder }) {
        const birthdayIndex = findItem(state.list, birthday)
        let updatedBirthday = state.list[birthdayIndex]
        const reminderIndex = findItem(updatedBirthday.reminders, reminder)
        updatedBirthday.reminders.splice(reminderIndex, 1)
        state.list.splice(birthdayIndex, 1, updatedBirthday)
    },

}

export const actions = {
    async get({ commit, state }, onlyOnce = false) {
        if (onlyOnce && state.loaded) {
            return
        }

        const res = await this.$axios.get(`/birthdays`)

        if (res.status === 200) {
            commit('set', res.data.birthdays)
        }
    },
    async addBirthday({ commit }, newBirthday) {
        try {
            const birthday = await this.$axios.$post('/birthdays', newBirthday)
            commit('add', birthday)
        } catch (error) { }
    },
    async updateBirthday({ commit }, updatedBirthday) {
        try {
            const birthday = await this.$axios.$put(`/birthdays/${updatedBirthday.id}`, updatedBirthday)
            commit('update', updatedBirthday)
        } catch (error) {

        }
    },
    async deleteBirthday({ commit }, birthday) {
        await this.$axios.$delete(`/birthdays/${birthday.id}`)
        commit('remove', birthday)
    },
    async addGift({ commit }, { birthday, newGift }) {
        try {
            const gift = await this.$axios.$post('/birthdays/' + birthday.id + '/gifts', newGift)
            commit('addGift', { birthday: birthday, gift: gift })
        } catch (error) {

        }
    },
    async deleteGift({ commit }, { birthday, gift }) {
        await this.$axios.$delete('/birthdays/' + birthday.id + '/gifts/' + gift.id)
        commit('deleteGift', { birthday: birthday, gift: gift })
    },
    async addReminder({ commit }, { birthday, newReminder }) {
        try {
            const reminder = await this.$axios.$post('/birthdays/' + birthday.id + '/reminders', newReminder)
            commit('addReminder', { birthday: birthday, reminder: reminder })
        }
        catch (error) {

        }
    },
    async deleteReminder({ commit }, { birthday, reminder }) {
        await this.$axios.$delete('/birthdays/' + birthday.id + '/reminders/' + reminder.id)
        commit('deleteReminder', { birthday: birthday, reminder: reminder })
    },
    reset({ commit }) {
        commit('reset')
    }
}

let findItem = (arr, _item) => {
    const itemIndex = arr.findIndex(
        item => item.id === _item.id
    );

    return itemIndex
}