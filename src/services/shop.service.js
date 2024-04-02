'use strict';
const shopModel = require('../models/shop.model');

const findByEmail = async ({email , select = {
	email : 1 , password : 2 , name : 1, status : 1, roles : 1, pic: 1 // Add 'pic' field to the select object
}}) => {
	return await shopModel.findOne({email}).select(select).lean();
};

module.exports = {
	findByEmail
};