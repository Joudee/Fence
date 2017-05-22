// App config the for development environment.

const serverURL = ''
const key = stripe_pk;

// const apiServerUrl = 'api.childhood.tusoapp.com'


const OSSdevConfig = {
	debug: true,
	apiServerUrl: serverURL,
	api: {
	}
}

const devConfig = {
	debug: true,
	apiServerUrl: serverURL,
	api: {
	},
	key
}

// App config the for production environment.
const proConfig = {
	debug: false,
	apiServerUrl: serverURL,
	api: {
	},
	key
}

const config = (process.env.NODE_ENV === "production") ? proConfig : devConfig
export default config
