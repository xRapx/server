'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/handleError')
const { authentication } = require('../../auth/authUtils')
const router = express.Router()

// signup
router.post('/shop/signup', asyncHandler(accessController.signUp) ) // handleError middleware controllor
// login 
router.post('/shop/login', asyncHandler(accessController.login) )
// authentication
router.use(authentication)
// logout
router.post('/shop/logout', asyncHandler(accessController.logout) )
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken) )


module.exports = router 