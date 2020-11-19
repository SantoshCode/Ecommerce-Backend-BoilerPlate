import ErrorResponse from '../utils/errorResponse.js'
import config from '../config/index.js'
import asyncHandler from '../middlewares/async.js'
import jwt from 'jsonwebtoken'

// Protect Routes
export const protect = asyncHandler(async (req, res, next) => {
	let token
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1]
	} else if (req.cookies.token) {
		token = req.cookies.token
	}

	if (req.cookies.admintoken) {
		token = req.cookies.admintoken
	}
	/*
   Here req.cookie.token
   i. if token wasn't found in the headers then it will look into
   the cookie so we don't have to put token in the headers any more
   it is useful when doing logout to clear cookie
   */

	// Make sure token exists
	if (!token) {
		return next(
			new ErrorResponse(`Not authorized to access this route`, 401)
		)
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, config.JWT_SECRET)
		req.payload = decoded
		next()
	} catch (err) {
		return next(
			new ErrorResponse(`Not authorized to access this route`, 403)
		)
	}
})

// Grant access to specific roles
export const authorize = (...roles) => {
	return (req, res, next) => {
		try {
			if (!roles.includes(req.payload.role)) {
				return next(
					new ErrorResponse(
						`Not authorized to access this route2`,
						403
					)
				)
			}
		} catch (err) {
			return next(
				new ErrorResponse(`Not authorized to access this route2`, 403)
			)
		}
		next()
	}
}
