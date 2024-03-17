'use strict' 

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload , publicKey , privateKey ) => {
	try {
		//accessToken
		const accessToken = await JWT.sign(payload, privateKey, {
			algorithm: 'RS256', // thuat toan
            expiresIn: '2 days' // het han
		})

		const refreshToken = await JWT.sign(payload, privateKey, {
			algorithm: 'RS256', // thuat toan
            expiresIn: '7 days' // het han
		})

		JWT.verify(accessToken , publicKey, (error, decode) => {
			if(error) {
				console.error(`Error verify ::` ,error)
			}else {
				console.log(`Decode verify ::`, decode)
			}
		})

		return {accessToken , refreshToken}

	} catch (error) {
		
	}
}

module.exports = {
	createTokenPair
}