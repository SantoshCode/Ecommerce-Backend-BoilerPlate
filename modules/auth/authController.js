import { Container } from 'typedi'
import AuthService from './authService.js'
import cookie from 'cookie-parser'
import config from '../../config/index.js'
import asyncHandler from '../../middlewares/async.js'
import ErrorResponse from '../../utils/errorResponse.js'
const AuthServiceInstance = Container.get(AuthService)

export const register = asyncHandler(async (req, res) => {
	console.log(req.body)
	const { name, email, password } = req.body
	// TODO check for no name, email, password wait to check for auto errorresposne
	//  TODO if not add it here ✅

	const { statusCode, options, token } = await AuthServiceInstance.Register({
		name,
		email,
		password,
	})

	res.status(201).cookie('token', token, options).json({
		success: true,
		token,
	})
})

export const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	// TODO✅ check for no name, email, password wait to check for auto errorresposne if not add it here
	// TODO check for valid email format
	if (!email || !password)
		throw new ErrorResponse(`Required fields are email and password`, 400)

	const { statusCode, options, token } = await AuthServiceInstance.Login({
		email,
		password,
	})

	res.status(200).cookie('token', token, options).json({
		success: true,
		token,
	})
})

export const logout = asyncHandler(async (req, res) => {
	// const cookie = req.cookie
	// Object.keys(cookie).forEach(item => {
	//    if(cookie.hasOwnProperty(item)){
	//       res.cookie(item, '', {expires: new Date})
	//    }
	// })
	res.cookie('token', 'none', {
		expires: new Date(0),
		httpOnly: true,
	})
	res.status(200).json({ success: true, data: {} })

	// res.redirect('/')
})
export const adminLogout = asyncHandler(async (req, res) => {
	// const cookie = req.cookie
	// Object.keys(cookie).forEach(item => {
	//    if(cookie.hasOwnProperty(item)){
	//       res.cookie(item, '', {expires: new Date})
	//    }
	// })
	res.cookie('admintoken', 'none', {
		expires: new Date(0),
		httpOnly: true,
	})
	res.status(200).json({ success: true, data: {} })

	// res.redirect('/')
})

export const adminLogin = asyncHandler(async (req, res) => {
	const { username, password } = req.body
	if (!username || !password)
		throw new ErrorResponse(`username, password are required`, 400)

	const { token, options } = await AuthServiceInstance.AdminLogin({
		username,
		password,
	})

	res.status(200).cookie('admintoken', token, options).json({
		success: true,
		admintoken: token,
	})
})

export const currentUser = asyncHandler(async (req, res) => {
	// payload from auth(protect) middleware
	const { payload } = req
	const user = await AuthServiceInstance.CurrentUser(payload)
	res.status(200).json({ success: true, data: user })
})
export const currentAdmin = asyncHandler(async (req, res) => {
	// payload from auth(protect) middleware
	const { payload } = req
	const admin = await AuthServiceInstance.CurrentAdmin(payload)
	res.status(200).json({ success: true, data: admin })
})
