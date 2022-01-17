export const initialState = null

export const reducer = (state, action)=>{
    switch (action.type) {
        case 'USER':
            return action.payload
        default:
            return state
    }
}