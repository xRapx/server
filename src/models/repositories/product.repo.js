'use strict'

const { populate } = require('dotenv')
const { product, electronic, clothing, furniture } = require('../../models/product.model')

const findAllDraftForShop = async (query, limit, skip) => {
	return await product.find(query)
	populate('product_shop', 'name email -_id')
	.sort({updateAt: -1})
	.limit(limit)
	.skip(skip)
	.lean()
	.exec()
}

module.exports = {
    findAllDraftForShop
}