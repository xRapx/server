'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require('./keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const {getInfoData} = require('../utils')
const { BadRequestError,ConflictRequestError,AuthFailureError, ForbiddenError } = require('../core/error.respon')
const { findByEmail } = require('./shop.service')
const {verifyJWT} = require('../auth/authUtils')

const RoleShop = {
	SHOP: 'SHOP',
	WRITER : 'WRITER',
	EDITOR: 'EDITOR',	
	ADMIN:'ADMIN'
}

class AccessService {

	static handleRefreshTokenV2 = async ({keyStore, user, refreshToken}) => {
		const {userId,email} = user;
		if (typeof refreshToken === 'object' && refreshToken !== null) {
			console.log('Biến là một đối tượng');
		  } else {
			console.log('Biến không phải là một đối tượng');
		  }

		if(keyStore.refreshTokenUsed.includes(refreshToken)){
			await KeyTokenService.deleteKeyById(userId)
			throw new ForbiddenError('Something Wrong Happend! Pls reLogin')
		}
		if(keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not registered!')

		const foundShop = await findByEmail({email})
		if(!foundShop) throw new AuthFailureError('Shop not registered!')

		const tokens = await createTokenPair({ userId , email} , keyStore.publicKey, keyStore.privateKey) // payload & key
		await keyStore.updateOne({
			$set:{
				refreshToken: tokens.refreshToken
			},
			$addToSet:{
				refreshTokenUsed : refreshToken
			},
		})
		return {
			user,
			tokens
		}
	}
//=====================================Handle RefreshTokenUsed=====================================================================================================
	/*
		1 - Thời điểm hết hạn của accsesstoken thì us check refreshTokenUsed :[] có refreshToken cũ đang được sử dụng hay ko ?
		2 - Nếu có thì sẻ verify RT xem là user nào trong db
		3 - Xoá keyStore userId
		4 - Nếu RT cũ đó không có xử dụng lại thì phải check lại 1 có đúng RT trong db ko? 
		5 - Để verify user đó là ai có trong db ko ?
		6 - Check userID có trong db ko ?
		7 - Cấp tokens mới cho User
		8 - Update refreshToken và đưa refreshToken cũ vào --> refreshTokenUsed : []
		9 - return về token mới cho user
	*/
	static handleRefreshToken = async (refreshToken) => {
		// 1.
		const foundToken = await KeyTokenService.foundByRefreshTokenUsed(refreshToken)
		if(foundToken) {
		// 2.	
			const {userId, email} = await verifyJWT(refreshToken ,foundToken.privateKey )
			console.log({userId, email});
		// 3.
			await KeyTokenService.deleteKeyById(userId)
			throw new ForbiddenError('Something Wrong Happend! Pls reLogin')
		}
		// 4.
		const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
		if(!holderToken) throw new AuthFailureError('Shop not registered!')
		// 5.
		const {userId, email} = await verifyJWT(refreshToken ,holderToken.privateKey )
		console.log(`[2]---`,{userId, email});
		// 6.
		const foundShop = await findByEmail({email})
		if(!foundShop) throw new AuthFailureError('Shop not registered!')
		// 7.
		const tokens = await createTokenPair({ userId , email} , holderToken.publicKey, holderToken.privateKey) // payload & key
		// 8.
		await holderToken.updateOne({
			$set:{
				refreshToken: tokens.refreshToken
			},
			$addToSet:{
				refreshTokenUsed : refreshToken
			},
		})
		// 9.
		return {
			user: {userId, email},
			tokens
		}
	}

//=====================================LOG OUT=====================================================================================================
	
	static logout = async (keyStore) => {
		const delKey = await KeyTokenService.removeByKeyId(keyStore._id)
		console.log(`delkey ::::::>>> `,delKey)
		return delKey
	}

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
			shop: getInfoData({fileds:['_id','name' ,'email','avatar'] , object: foundShop }),
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
						shop: getInfoData({fileds:['_id','name' ,'email','avatar'] , object: newShop }), // Chỉ in giá trị cần dùng trong req
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