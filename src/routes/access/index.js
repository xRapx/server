'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const asyncHandler = require('../../helpers/handleError')
const router = express.Router()

// signup
router.post('/shop/signup', asyncHandler(accessController.signUp) ) // handleError middleware controllor

//login 
router.post('/shop/login', asyncHandler(accessController.login) )


module.exports = router 