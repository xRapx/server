'use strict'

const AccessService = require("../services/access.service")

const {OK, CREATED , SuccessResponse } = require('../core/success.response')

class AccessController {
	
	handleRefreshToken = async (req, res , next) => {
		// V1
		// new SuccessResponse({
		// 	message : "Get Token Success",
		// 	metadata : await AccessService.handleRefreshToken(req.body.refreshToken),
		// }).send(res)

		// V2 no need accessToken Fixed
		new SuccessResponse({
            message : "Get Token V2 Success",		
            metadata : await AccessService.handleRefreshTokenV2({
				keyStore : req.keyStore,
				user: req.user,
				refreshToken: req.refreshToken
			}),
        }).send(res)
	}

	logout = async (req, res , next) => {

		new SuccessResponse({
			message : "Logout Success",
			metadata : await AccessService.logout(req.keyStore),
		}).send(res)
	}

	login = async (req, res , next) => {

		new SuccessResponse({
			metadata : await AccessService.login(req.body),
		}).send(res)
	}

	signUp = async (req, res , next) => {

			new CREATED({
				message: "Registered OK!",
				metadata : await AccessService.signUp(req.body),
				option:{
					limit: 10
				}
			}).send(res)
	}
}

module.exports = new AccessController()	