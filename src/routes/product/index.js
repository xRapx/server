'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/handleError')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

// authentication
router.use(authenticationV2)

router.post('', asyncHandler(productController.createProduct ))

// Query
router.get('/draft/all', asyncHandler(productController.getAllDraftForShop ))

module.exports = router 