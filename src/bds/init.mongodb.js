'use strict'
// strict mode
require('dotenv').config()
const {db : {host , port, name}} = require('../configs/config.mongodb')

const mongoose = require('mongoose')
const connectString = `mongodb://${host}:${port}/${name}`
const {countConnect} = require('../helpers/check.connect')

class Database {
	constructor() {
		this.connect()
	}
	connect(type = 'mongodb') {
		if(1 === 1 ) {
			mongoose.set('debug', true)
			mongoose.set('debug',{color :true})
		}

        mongoose.connect(connectString).then( _ => {
			console.log(`Connected Mongodb Success`, countConnect())
		})
        .catch(err => console.log(`Error connecting Mongodb: ${err}`))
    }

	static getInstance() {
		if(!Database.instance) {
			Database.instance = new Database()
		}
		return Database.instance
	}
}

const  instanceMongdb = Database.getInstance()
module.exports  = instanceMongdb