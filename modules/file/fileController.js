import path from 'path'
import mongoose from 'mongoose'
const File = mongoose.model('File')
import slugify from 'slugify'
import asyncHandler from '../../middlewares/async.js'
import ErrorResponse from '../../utils/errorResponse.js'

const moveFile = asyncHandler((file, dir) => {
	return new Promise((resolve, reject) => {
		file.mv(dir, function (err) {
			if (err) {
				reject(new ErrorResponse("Couldn't move file"))
				// reject("Couldn't move file.")
			} else {
				resolve()
			}
		})
	})
})

export const store = asyncHandler(async (req, res) => {
	if (!req.files) throw new ErrorResponse("File wasn't supplied.", 400)

	const file = req.files.file
	const fileName = file.name
	const size = file.data.length
	const extension = path.extname(fileName)
	const name_no_ext = path.parse(fileName).name
	const allowedExtensions = /png|jpg|gif|jpeg/

	//   Md5 ensure same file cannot be uploaded twice and if uploaded it don't store that file twice in storage
	//   just reference previous file
	//   const md5 = file.md5;

	const validExtension = allowedExtensions.test(extension.toLowerCase())

	if (!validExtension)
		throw new ErrorResponse('Only image file is allowed!', 400)
	if (size > 10000000)
		throw new ErrorResponse('File size must be less than 10 MB', 400)

	const modified_file_name =
		slugify(name_no_ext, { lower: true, replacement: '_', strict: true }) +
		'_' +
		Date.now().toString().substr(-4)

	const URL = '/uploads/' + modified_file_name + extension
	await moveFile(file, './public' + URL)

	const newFile = new File({
		url: URL,
		file_name: fileName,
		size: size,
	})

	await newFile.save()

	res.json({
		message: 'File uploaded successfully',
		id: newFile.id,
		url: URL,
	})
})

export const read = asyncHandler(async (req, res) => {
	const files = await File.find({}, 'url file_name size created_at').lean()
	res.json(files)
})
