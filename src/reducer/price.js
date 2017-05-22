const initialState = {
	"retCode":0,
	"data":[]
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'PRICE':
            return action.data
        default:
            return state
    }
}