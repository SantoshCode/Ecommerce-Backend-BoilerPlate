import mongoose from 'mongoose'
import { randomBytes } from 'crypto'
import { hash, verify } from 'argon2'
import jwt from 'jsonwebtoken'
import config from '../../config/index.js'
import ErrorResponse from '../../utils/errorResponse.js'

class AuthService {
	// container is injected by typeid
	constructor(container) {
		this.user = mongoose.model('User')
		this.admin = mongoose.model('Admin')
	}
	Register = async payload => {
		// TODO check for duplicate email✅
		// TODO check for valid email format
		const salt = randomBytes(32)
		const hashedPassword = await hash(payload.password, { salt })
		const user = await this.user.create({
			...payload,
			password: hashedPassword,
			role: 'USER',
		})

		console.log('register')
		console.log(user.role)
		// TODO send welcome message

		// Generate token
		const token = this.generateToken(user)

		// return hashed pass user and token
		return this.sendTokenResponse(user)
	}

	Login = async payload => {
		const { email, password } = payload
		// Check for use
		const user = await this.user.findOne({ email }).select('+password')
		if (!user) throw new ErrorResponse(`Invalid credentails`, 401)

		// Check if password matches
		const validPassword = await verify(user.password, payload.password)
		if (!validPassword) throw new ErrorResponse(`Invalid credentails`, 401)

		// Generate token
		// const token = this.generateToken(user)
		console.log(user)
		// return hashed pass user and token
		return this.sendTokenResponse(user)
	}

	AdminLogin = async payload => {
		const res = await this.admin.findOne({
			key: 'admin',
			'value.username': payload.username,
			'value.password': payload.password,
		})

		if (!res) throw new ErrorResponse(`Invalid credentials`, 400)
		const tokenData = {
			id: res._id,
			name: res.username,
			role: 'ADMIN',
		}
		// const accesstoken = this.generateToken(tokenData)

		// return {
		// 	message: 'Logged in successfully',
		// 	token: accesstoken,
		// 	data: tokenData,
		// }
		return this.sendTokenResponse(tokenData)
	}
	CurrentUser = async payload => {
		const user = await this.user.findById(payload._id)
		return user
	}
	CurrentAdmin = async payload => {
		const admin = await this.admin.findById(payload._id)
		return admin
	}

	generateToken(user) {
		return jwt.sign(
			{ _id: user.id, role: user.role ? user.role : undefined },
			config.JWT_SECRET,
			{
				expiresIn: config.JWT_EXPIRE,
			}
		)
	}
	sendTokenResponse(user) {
		// Create token
		const token = this.generateToken(user)

		const options = {
			expires: new Date(
				Date.now() + config.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
			),
			httpOnly: true,
		}
		if (process.env.NODE_ENV === 'production') {
			options.secure = true
		}

		return {
			options,
			token,
		}
	}
}

export default AuthService
