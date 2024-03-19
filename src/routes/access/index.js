'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const { asyncHandler } = require('../../auth/checkAuth')
const router = express.Router()

// signup
router.post('/shop/signup', asyncHandler(accessController.signUp) ) // handleError middleware controllor


module.exports = router 