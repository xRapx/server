'use strict'

const ProductService = require("../services/product.service")
const ProductServiceV2 = require("../services/product.service.xxx")

const {SuccessResponse } = require('../core/success.response')

class ProductController {
	
	createProduct = async (req, res , next) => {
		
		// new SuccessResponse({
		// 	message : "Create new Product success!",
		// 	metadata : await ProductService.createProduct(req.body.product_type,{
		// 		...req.body,
		// 		product_shop: req.user.userId
		// 	}),
		// }).send(res)

		// V2
		new SuccessResponse({
			message : "Create new Product success!",
			metadata : await ProductServiceV2.createProduct(req.body.product_type,{
				...req.body,
				product_shop: req.user.userId
			}),
		}).send(res)
	}
	
	//Query
	/**
	 * @desc Get alt Draft for Shop
	 * @param {Number} limit 
	 * @param {Number} skip 
	 * @param {JSON} 
	 */
	getAllDraftForShop = async (req, res, next) => {
		new SuccessResponse({
			message : "Get list Draft success!",
			metadata : await ProductServiceV2.findAllDraftForShop({
				product_shop: req.user.userId
			}),
		}).send(res)
	}
}

module.exports = new ProductController()	