import mongoose from 'mongoose'
import slugify from 'slugify'

import ErrorResponse from '../../utils/errorResponse.js'

class CategoryService {
	constructor(container) {
		this.category = mongoose.model('Category')
		this.product = mongoose.model('Product')
		this.review = mongoose.model('Review')
	}

	Store = async payload => {
		const { name, tagline, images } = payload
		const slug = slugify(name, { lower: true }) // make a slug for name and ensure all text are at lowercase eg I AM HERO converted to i-am-hero
		const isExist = await this.category.findOne({ slug })
		if (isExist)
			throw new ErrorResponse(
				'Category with given name already exist',
				400
			)

		const newItem = new this.category({
			name,
			slug,
			tagline,
			images,
		})

		await newItem.save()
		return { message: 'Category added successfully', payload: newItem }
	}

	Delete = async category_id => {
		const isExist = await this.category.findById(category_id)
		if (!isExist) throw new ErrorResponse('Category not found', 400)
		await isExist.remove()
		return { message: 'Category deleted successfully' }
	}

	Update = async (category_id, payload) => {
		let findItem = await this.category.findById(category_id)
		if (!findItem) throw new ErrorResponse('category not found', 400)

		if (payload.name) {
			payload.slug = slugify(payload.name, { lower: true })
		}

		findItem = await this.category.findByIdAndUpdate(category_id, payload, {
			new: true,
			runValidators: true,
		})

		return { message: 'category updated successfully' }
	}

	ReadAsAdmin = async () => {
		const filterParams =
			'name images views tagline slug created_at updated_at'
		const findList = await this.category
			.find({}, filterParams)
			.sort({ _id: -1 })
			.lean() // sorting for latest value, lean convert to Flat JS object
		if (!findList || findList.length === 0)
			throw new ErrorResponse('Category not found', 400)
		return findList
	}

	ReadAsUser = async () => {
		const filterParams =
			'name images views tagline slug created_at updated_at'
		const findList = await this.category
			.find({}, filterParams)
			.sort({ views: -1 })
			.lean() // sorting for highest no of views to lowest number to display at homepage
		if (!findList || findList.length === 0)
			throw new ErrorResponse('Category not found', 400)
		return findList
	}

	ReadFromSlug = async slug => {
		const finder = await this.category.findOne({ slug }).lean()
		if (!finder) throw new ErrorResponse('Category not found', 400)
		const product = await this.product.find({ category: finder._id }).lean()
		const productIds = product.map(item => item._id)
		const review = await this.review
			.find({ product: { $in: productIds } })
			.populate('user', 'name')
			.populate('product', 'name slug')
			.lean()

		let avgRating = 0
		review.forEach(item => {
			avgRating += item.rating
		})
		avgRating = avgRating / review.length

		return {
			...finder,
			products: product,
			reviews: review,
			average_rating: avgRating ? avgRating : 5,
		}
	}
}

export default CategoryService
