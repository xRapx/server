'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const {getInfoData} = require('../utils')
const { BadRequestError } = require('../core/error.respon')

const RoleShop = {
	SHOP: 'SHOP',
	WRITER : 'WRITER',
	EDITOR: 'EDITOR',
	ADMIN:'ADMIN'
}

class AccessService {
	static signUp = async ({name, email, password}) =>{		
			// 1. check email exits ??			
			const holderShop = await shopModel.findOne({email}).lean()
			if(holderShop){
				throw new BadRequestError('Error : Shop is already registered!');

			}

			const passwordHash = await bcrypt.hash(password,10)

			// create newShop
			const newShop = await shopModel.create({
				name,email,password : passwordHash,roles:[RoleShop.SHOP]
			})

			if(newShop) {
				// created privateKEy, publicKey 
				// 2. Định dạng Key BASIC 
				const publicKey = crypto.randomBytes(60).toString('hex')
				const privateKey = crypto.randomBytes(60).toString('hex')

				const keyStore = await KeyTokenService.createKeyToken({ // call service help conver tostring 
					userId : newShop._id,
                    publicKey,
					privateKey 
				})
				
				if(!keyStore){
					return {
						code:'xxx',
						message: 'KeyStore Error'
					}
				}

				//create token pair for new Shop
				const tokens = await createTokenPair({userId : newShop._id, email} , publicKey, privateKey) // payload & key 
				
				// after await verify with createTokenPair on authUtils.js 
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
	}
}

module.exports = AccessService