'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const {getInfoData} = require('../utils')

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

					modulusLength: 4096,
					publicKeyEncoding:{  // Định dạng Key CryptoGraphy Standards mã hoá cho "rsa"
						type:'pkcs1',
						format:'pem'    // Mã nhị phân
					},
					privateKeyEncoding:{  
						type:'pkcs1',
						format:'pem'    
					}
				})
				//  save publicKey collection keystore
				console.log({privateKey, publicKey}) 
			
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
				//Khi có publickey
				const publicKeyObject = crypto.createPublicKey(publicKeyString)
				console.log(`Create Tokens PublickeyObject ::`, publicKeyObject)

				//create token pair for new Shop
				const tokens = await createTokenPair({userId : newShop._id, email} , publicKeyString, privateKey) // payload & key 
				console.log(`Create token success ::` , tokens)
				
				return {
					code : 201,
					metadata : {
						shop: getInfoData({fileds:['_id','name' ,'email'] , object: newShop }), // Chỉ in giá trị cần dùng trong req
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