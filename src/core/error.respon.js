'use strict'

const StatusCode = {
	FORBIDDEN : 403,
	CONFLICT : 409
}

const ReasonStatusCode = {
	FORBIDDEN : "Bad request error",
	CONFLICT : "Conflict error"
}

class ErrorResponse extends Error {
	constructor(message , status ) {
        super(message)
        this.status = status
    }
}
// Kế thừa Error của NodeJS
class ConflictRequestError extends ErrorResponse {
	constructor(message = ReasonStatusCode.CONFLICT ,statusCode = StatusCode.FORBIDDEN ) {
		super(message,statusCode)
	}
}

class BadRequestError extends ErrorResponse {
	constructor(message = ReasonStatusCode.CONFLICT ,statusCode = StatusCode.FORBIDDEN ) {
		super(message,statusCode)
	}
}

class AuthFailureError extends ErrorResponse {
	constructor(message = ReasonStatusCode.UNAUTHORIZED ,statusCode = StatusCode.UNAUTHORIZED ) {
		super(message,statusCode)
	}
}


module.exports = {
	ConflictRequestError,
	BadRequestError,
	AuthFailureError

}