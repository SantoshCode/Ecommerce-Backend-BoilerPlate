import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
		},
		email: {
			type: String,
			required: [true, 'Please add an email'],
			unique: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please add a valid email',
			],
		},
		role: {
			type: String,
			enum: ['USER'],
			default: 'USER',
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
			minlength: [6, 'Password should be atlease 6 character long'],
			select: false,
		},
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{ timestamps: true }
)

export default mongoose.model('User', UserSchema)
