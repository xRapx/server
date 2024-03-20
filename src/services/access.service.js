'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const {getInfoData} = require('../utils')
const { BadRequestError,ConflictRequestError,AuthFailureError } = require('../core/error.respon')
const { findByEmail } = require('./shop.service')

const RoleShop = {
	SHOP: 'SHOP',
	WRITER : 'WRITER',
	EDITOR: 'EDITOR',
	ADMIN:'ADMIN'
}

class AccessService {
//=====================================LOG IN=====================================================================================================
	/*
		1 - check email in dbs
		2 - match password
		3 - create apiTK vs refreshTK and save
		4 - xác thực và ủy quyền trong tài khoản
		5 - get data return login
	*/
	static login = async ({email, password, refreshToken = null}) => {

		// 1.
		const foundShop = await findByEmail({email})
			//CHECK
			if(!foundShop) throw new BadRequestError('Shop not registered!')

		// 2.
		const match = bcrypt.compare(password , foundShop.password)
		    //CHECK	
			if(!match) throw new AuthFailureError('Authentication Error')

		// 3.
		const publicKey = crypto.randomBytes(60).toString('hex')
		const privateKey = crypto.randomBytes(60).toString('hex')
					
		// 4.
			// Nếu có biến sử dụng lại thì phải khai báo có thể chuyển đổi thành destructuring 
			// const {_id : userId} = foundShop 
			const userId = foundShop._id
		const tokens = await createTokenPair({ userId , email} , publicKey, privateKey) // payload & key 				
			//CHECK after await verify with createTokenPair on authUtils.js 
			console.log(`Create token success LOGIN ::` , tokens)
		
			//check verify refreshToken
			await KeyTokenService.createKeyToken({ // call service help conver tostring 
				refreshToken: tokens.refreshToken,
				publicKey,
				privateKey,
				userId
			})

		// 5.
		return {			
			shop: getInfoData({fileds:['_id','name' ,'email'] , object: foundShop }),
			tokens
		}
	}

// ==================================SIGN UP=====================================================================================================
	/*
		1 - check email exits ??		
		2 - create new Shop
		3 - create created privateKEy, publicKey
		4 - save Key Store
		5 - create token pair & verify new Shop
		6 - get data return signUp
	*/
	static signUp = async ({name, email, password}) =>{			
			// 1. 		
			const holderShop = await shopModel.findOne({email}).lean()
				//CHECK
				if(holderShop){
					throw new BadRequestError('Error : Shop is already registered!');
				}

			const passwordHash = await bcrypt.hash(password,10)

			// 2.
			const newShop = await shopModel.create({
				name,email,password : passwordHash,roles:[RoleShop.SHOP]
			})
				//CHECK
				if(newShop) {
			// 3.
				const publicKey = crypto.randomBytes(60).toString('hex')
				const privateKey = crypto.randomBytes(60).toString('hex')
			// 4.
				const keyStore = await KeyTokenService.createKeyToken({ // call service help conver tostring 
					userId : newShop._id,
                    publicKey,
					privateKey 
				})
				//CHECK
				if(!keyStore){throw new ConflictRequestError('KeyStore Error')}
			// 5.
				const tokens = await createTokenPair({userId : newShop._id, email} , publicKey, privateKey) // payload & key 
				
				//CHECK after await verify with createTokenPair on authUtils.js 
				console.log(`Create token success ::` , tokens)
			// 6 .	
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