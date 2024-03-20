//handler Error async khi hàm controller truyền vào
const asyncHandler = fn => {
	return (req, res, next) => {
		fn(req, res, next).catch(error => next(error))
	}
}

module.exports = asyncHandler