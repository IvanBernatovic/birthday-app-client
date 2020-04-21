import Vue from 'vue'

export default function ({ $axios }) {
    $axios.onError(error => {
        if (error.response.status === 422) {
            let fieldErrorMessage = Object.values(error.response.data.errors)[0][0]
            Vue.notify({
                type: 'error',
                title: 'Validation error',
                text: fieldErrorMessage
            })

            return false
        }

        Vue.notify({
            type: 'error',
            title: 'Error',
            text: 'Sorry about this, please try again later.'
        })
    })
}