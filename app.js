import express from 'express'
import errorHandler from './middlewares/error.js'
import helmet from 'helmet'
import xss from 'xss-clean'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import mongooSanitize from 'express-mongo-sanitize'
import fileupload from 'express-fileupload'

// Load env vars
import config from './config/index.js'

// DB loader
import connectDB from './loaders/databaseLoader.js'

// ROute loader
import routesLoader from './loaders/routesLoader.js'

const startServer = async () => {
	const app = express()

	// Connect to DB
	await connectDB()

	// File uploading
	app.use(fileupload())

	// Sanitize data
	app.use(mongooSanitize())

	// Set security headers
	app.use(helmet())

	// Prevent XSS attacks
	app.use(xss())

	// Rate limiting
	const limiter = rateLimit({
		windowMs: 10 * 60 * 1000, // 10 mins
		max: 100,
	})
	app.use(limiter)

	// Prevent http param pollution
	app.use(hpp())

	// Enable CORS
	app.use(cors())

	// Load all models
	await import('./loaders/modelLoader.js')

	// express json parser
	app.use(express.json())

	// cookie-parser
	app.use(cookieParser())

	//Bring in the routes!
	app.use(config.ENDPOINT_PREFIX, await routesLoader())

	app.get('/status', (req, res) => {
		res.json({ success: true })
	})

	// Error Middleware
	app.use(errorHandler)

	const server = app.listen(config.PORT, () =>
		console.log(
			`Server running on port ${config.PORT} in ${config.NODE_ENV} mode`
		)
	)

	process.on('unhandledRejection', (err, promise) => {
		console.log('Error: ', err)
		server.close(() => process.exit(1))
	})
}

startServer()
