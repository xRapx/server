'use strict'
//import
require('dotenv').config()

const dev =  {
	app : {
		port : process.env.DEV_DB_PORT || 8000,
	},
	db : {
		host : process.env.DEV_DB_HOST,   
		user : process.env.DEV_DB_USER,
		pass : process.env.DEV_DB_PASS
	}
}


const pro =  {
	app : {
		port : process.env.PRO_DB_PORT || 900,
	},
	db : {
		host : process.env.PRO_DB_HOST,   
		user : process.env.PRO_DB_USER,
		pass : process.env.PRO_DB_PASS
	}
}

const config = {dev, pro}
const env = process.env.NODE_DEV || "dev"
module.exports = config[env]