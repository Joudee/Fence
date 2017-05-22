import {AppContainer} from './containers/AppContainer'
import React from 'react'
import {Route, IndexRoute,browserHistory,Router} from 'react-router'
import {ReduxRouter} from 'redux-router'

const routes = (
	<ReduxRouter>
		<Route path="/">
			<IndexRoute component={AppContainer()}></IndexRoute>
		</Route>
	</ReduxRouter>
)

export default routes