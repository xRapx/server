'use strict'

const _ = require('lodash')

const getInfoData = ({object ={}, fileds =[]}) => {

	//Lưu ý pick() tham số đầu tiên là 1 object trước tiên thay đổi vị trí sẻ không nhận đúng object từ metadata
	return _.pick(object , fileds ) 
}

module.exports = {
    getInfoData
}