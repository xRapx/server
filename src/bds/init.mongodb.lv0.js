'use strict'
// strict mode

const mongoose = require('mongoose')

const connectString = `......url mongo`

mongoose.connect(connectString).then( _ => console.log(`Connected Mongodb Success`))
 .catch(err => console.log(`Error connecting Mongodb: ${err}`))

//dev
if(1 === 1 ) {
	mongoose.set('debug', true)
	mongoose.set('debug',{color :true})
}