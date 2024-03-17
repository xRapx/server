'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')

const RoleShop = {
	SHOP: 'SHOP',
	WRITER : 'WRITER',
	EDITOR: 'EDITOR',
	ADMIN:'ADMIN'
}

class AccessService {
	static signUp = async ({name, email, password}) =>{
		try {
			// 1. check email exits ??
			const holderShop = await shopModel.findOne({email}).lean()
			if(holderShop){
				return {
					code:'xxx',
					message: 'Shop already registered'
				}
			}

			const passwordHash = await bcrypt.hash(password,10)

			// create newShop
			const newShop = await shopModel.create({
				name,email,password : passwordHash,roles:[RoleShop.SHOP]
			})

			if(newShop) {
				// created privateKEy, publicKey 
				const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
					modulusLength: 4096
				})
				console.log({privateKey, publicKey}) // save collection keystore
			
				const publicKeyString = await KeyTokenService.createKeyToken({ // call service help conver tostring 
					userId : newShop._id,
                    publicKey  
				})
				if(!publicKeyString){
					return {
						code:'xxx',
						message: 'publicKeyString Error'
					}
				}

				//create token pair for new Shop
				const tokens = await createTokenPair({userId : newShop._id, email} , publicKeyString, privateKey) // payload & key 
				console.log(`Create token success ::` , tokens)
				
				return {
					code : 201,
					metadata : {
						shop: newShop,
						tokens
					}
				}

			}

			// nếu newShop ko tồn tại thì sẻ trả về 
			return {
				code : 200,
				metadata : null
			}

		} catch (error) {
			return {
				code:'xxx',
				message: error.message,
				status:'error'
			}
		}
	}
}

module.exports = AccessService