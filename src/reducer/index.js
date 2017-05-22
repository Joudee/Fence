import {combineReducers} from 'redux-immutablejs'
import {routerStateReducer} from 'redux-router'
import price from './price'



export const reducer = combineReducers({
	route: routerStateReducer,
	price
})
