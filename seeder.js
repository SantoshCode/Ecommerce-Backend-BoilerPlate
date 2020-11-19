import mongoose from 'mongoose'
import config from './config/index.js'
mongoose.connect(config.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
})

// Load all models
import User from './models/User.js'

// const importData = async () => {
// 	try {
// 		await User.deleteMany()
// 	} catch (err) {
// 		console.error(err)
// 	}
// }

const deleteData = async () => {
	try {
		await User.deleteMany()
		console.log('data deleted')
		process.exit()
	} catch (err) {
		console.error(err)
	}
}

if (process.argv[2] === '-i') {
	importData()
} else if (process.argv[2] === '-d') {
	deleteData()
}
