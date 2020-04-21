export const actions = {
    reset({ commit, dispatch }) {
        let modules = ['birthdays']

        modules.forEach(module => {
            dispatch(module+'/reset')
        });
    }
}