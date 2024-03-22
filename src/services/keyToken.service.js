'use strict'

const keyTokenModel = require("../models/keytoken.model")
const {Types} = require('mongoose')

//  Thông qua class Service để conver model
class KeyTokenService {
	// Create KeyToken
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

	// Find UserId
	static findByUserId = async (userId) => {
		return await keyTokenModel.findOne({user: userId}).lean()
	}

	// Delete KeyToken
	static removeByKeyId = async (id) =>{
		return await keyTokenModel.deleteOne(id)
	}

	// Found RefreshTokenUsed
	static foundByRefreshTokenUsed = async (refreshToken) =>{
		return await keyTokenModel.findOne({refreshTokenUsed :refreshToken } ).lean()
	}
	//found refreshToken 
	static findByRefreshToken = async (refreshToken) =>{
		return await keyTokenModel.findOne({refreshToken})
	}
	//delete UserId
	static deleteKeyById = async (userId) =>{
		return await keyTokenModel.findByIdAndDelete({user: userId})
	}
}

module.exports = KeyTokenService