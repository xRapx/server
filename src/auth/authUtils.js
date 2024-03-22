'use strict' 

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/handleError')
const { AuthFailureError, NotFoundError } = require('../core/error.respon')
const {findByUserId} = require('../services/keyToken.service')

const HEADER = {
	API_KEY:'x-api-key',
	CLIENT_ID : 'x-client-id',
	AUTHORIZATION : 'authorization'
}

const createTokenPair = async (payload , publicKey , privateKey ) => {
	try {
		//accessToken
		const accessToken = await JWT.sign(payload, publicKey, {
			// algorithm: 'RS256', // thuat toan
            expiresIn: '2 days' // het han
		})

		const refreshToken = await JWT.sign(payload, privateKey, {
			// algorithm: 'RS256', // thuat toan
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
		console.log(`payload & tokens empty :::`, error)
	}
}

const authentication = asyncHandler(async (req, res , next) => {
	/*
		1 - Check userId  missing ?
		2 - get accessToken
		3 - verify Token
		4 - check user in dbs ?
		5 - check keyStore  with this userId
		6 - 0k : return => next()
	*/
	// 1.
	const userId = req.headers[HEADER.CLIENT_ID]
		//CHECK
		if(!userId) throw new AuthFailureError('Invalid Request')

	const keyStore = await findByUserId(userId)
		//CHECK
		if(!keyStore) throw new NotFoundError('NotFound KeyStore')
	
	// 2.	
	const accessToken = req.headers[HEADER.AUTHORIZATION]
		//CHECK
		if(!accessToken) throw new AuthFailureError('Invalid Request')

	try {
	// 3.	
		const decodeUser = JWT.verify(accessToken ,keyStore.publicKey)
	// 4.
		if(userId !== decodeUser.userId ) throw new AuthFailureError('Invalid UserID')
			req.keyStore = keyStore
			return next()
	} catch (error) {
		throw error
	}	
})

const verifyJWT = async (token , keySecret) => {
	if (!keySecret) {
		throw new Error('No secret or public key provided');
	}
	return await JWT.verify(token, keySecret);
}
	
module.exports = {
	createTokenPair,
	authentication,
	verifyJWT
}