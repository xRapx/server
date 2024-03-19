'use strict'

const {findById} = require('../services/apikey.service')

const HEADER = {
	API_KEY:'x-api-key',
	AUTHORIZATION : 'authorization'
}

//Middleware
const apiKey = async (req, res, next) => {
	try {
		const key = req.headers[HEADER.API_KEY]?.toString()
		if(!key){
			return res.status(403).json({
				message: "Forbidden Error 1"
			})
		}

		//check objectKey
		const objKey = await findById(key)
		if(!objKey) {
			return res.status(403).json({
                message: "Forbidden Error 2"
            })
		}
		// Nếu tồn tại
		req.objKey = objKey;
		
		return next();

	} catch (error) {
		
	}
}
//check permisstions lưu ý số ít số nhiều
const permission = (permission) =>{
	return (req,res,next) =>{
		if(!req.objKey.permissions){
			return res.status(403).json({
                message: "Permission Error Denied 1"
            })
		}
		
		console.log(`permissions :: `,req.objKey.permissions)
		const validPermission = req.objKey.permissions.includes(permission)
		if(!validPermission){
			return res.status(403).json({
                message: "Permission Error Denied 2"
            })
		}
		return next();
	}
}

//handler Error async khi hàm controller truyền vào
const asyncHandler = fn => {
	return (req, res, next) => {
		fn(req, res, next).catch(error => next(error))
	}
}

module.exports = {
    apiKey,
	permission,
	asyncHandler
}