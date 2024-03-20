'use strict'

const keyTokenModel = require("../models/keytoken.model")

//  Thông qua class Service để conver model
class KeyTokenService {
	static createKeyToken = async ({userId, publicKey ,privateKey, refreshToken}) =>{
		try {
			// level 0 
			// const tokens = await keyTokenModel.create({
			// 	user: userId,
			// 	publicKey,
			// 	privateKey
			// })
			// level > 0
			const filter = {user : userId} , update ={
				publicKey , privateKey, refreshTokenUsed : [], refreshToken
			} , options = { upsert: true , new : true }

			const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)

			return tokens ? tokens.publicKey : null

		} catch (error) {
			return error
		}
	}
}

module.exports = KeyTokenService