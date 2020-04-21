export const mutations = {
    update(state, user) {
        
    }
}

export const actions = {
    async updateUser({ commit }, payload) {
        const res = await this.$axios.patch('me', payload)
    }
}