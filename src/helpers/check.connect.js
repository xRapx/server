'use strict'
//import
const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

// Function count connect
const countConnect = () =>{
	const numConnection = mongoose.connection.readyState
	console.log(`Number of connections :: ${numConnection}`)
}

// Function check over load
const checkOverLoad = () =>{
	setInterval(() =>{
		const numConnection = mongoose.connections.length // check số lần kết nối
		const numCores = os.cpus().length				// check số lõi CPU của hệ thống,
		const memoryUsage = process.memoryUsage().rss    // check  bộ nhớ đang sử dụng 

		// Example maximum number of connections based on number osf cores
		const maxConnections = numCores * 5

		//check Memory
		console.log(`Active connections :: ${numConnection}`)
		console.log(`Memmory usage :: ${memoryUsage / 1024 / 1024} MB`)

		if(numConnection > maxConnections) {
			console.log(`COnnection overload delected`)
			//Notify.send (...)
		}
	},_SECONDS) // Monitor every5 seconds
}

module.exports = {
	countConnect,
	checkOverLoad
}