import mongoose from 'mongoose'
import ErrorResponse from '../../utils/errorResponse.js'

class ReviewService {
	constructor(container) {
		this.review = mongoose.model('Review')
	}

	store = async (payload, userId) => {
		const isExist = await this.review.findOne({
			product: payload.product,
			user: userId,
		})
		if (isExist) throw new ErrorResponse('Already Reviewed', 400)
		const newItem = new this.review({ ...payload, user: userId })
		await newItem.save()
		return { message: 'Reviewed successfully', payload: newItem }
	}

	read = async () => {
		let filter = 'review rating product user created_at updated_at'
		const findList = await this.review
			.find({}, filter)
			.sort({ rating: -1 })
			.populate('product', 'name slug')
			.populate('user', 'name images')
			.lean() // sorting for highest rating
		if (!findList || findList.length === 0)
			throw new ErrorResponse('Reviews not found', 404)
		return findList
	}

	remove = async id => {
		const isExist = await this.review.findById(id)
		if (!isExist) new ErrorResponse('Reviews not found', 404)
		await isExist.remove()
		return { message: 'Review deleted successfully' }
	}
}

export default ReviewService
