'use strict'

const keyTokenModel = require("../models/keytoken.model")

//  Thông qua class Service để conver model
class KeyTokenService {
	static createKeyToken = async ({userId, publicKey ,privateKey}) =>{
		try {
			const tokens = await keyTokenModel.create({
				user: userId,
				publicKey,
				privateKey
			})

			return tokens ? tokens.publicKey : null
		} catch (error) {
			return error
		}
	}
}

module.exports = KeyTokenService