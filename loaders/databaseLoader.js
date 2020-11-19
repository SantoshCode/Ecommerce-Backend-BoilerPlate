import config from '../config/index.js'
import mongoose from 'mongoose'

export default async () => {
	const conn = await mongoose.connect(config.MONGO_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	console.log(
		`DB connected database: ${conn.connection.db.databaseName} \n host: ${conn.connection.host} `
	)
}
