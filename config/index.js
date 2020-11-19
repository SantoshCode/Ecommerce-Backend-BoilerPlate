import dotenv from 'dotenv'

// Load env vars from .env file
const envFound = dotenv.config()

if (!envFound) throw new ErrorResponse('env file missing', 500)

export default {
	PORT: process.env.PORT,
	NODE_ENV: process.env.NODE_ENV,
	MONGO_URI: process.env.MONGO_URI,
	ENDPOINT_PREFIX: process.env.ENDPOINT_PREFIX,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRE: process.env.JWT_EXPIRE,
	JWT_COOKIE_EXPIRE: process.env.JWT_COOKIE_EXPIRE,
}
