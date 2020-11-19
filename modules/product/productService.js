import mongoose from 'mongoose'
import slugify from 'slugify'
import ErrorResponse from '../../utils/errorResponse.js'

class ProductService {
	constructor(container) {
		this.product = mongoose.model('Product')
		this.review = mongoose.model('Review')
	}

	Store = async payload => {
		const { name, images, category, price, search_tags } = payload
		const slug = slugify(name, { lower: true }) // make a slug for name and ensure all text are at lowercase eg I AM HERO converted to i-am-hero
		const isExist = await this.product.findOne({ slug })
		if (isExist)
			throw new ErrorResponse(
				'Product with given name already exist',
				400
			)

		const newItem = new this.product({
			name,
			images,
			category,
			price,
			search_tags,
			slug,
		})

		await newItem.save()
		return { message: 'Product added successfully', payload: newItem }
	}

	Delete = async productId => {
		const isExist = await this.product.findById(productId)
		if (!isExist) throw new ErrorResponse('Product not found', 400)
		await isExist.remove()
		return { message: 'Product deleted successfully' }
	}

	Update = async (productId, payload) => {
		let findItem = await this.product.findById(productId)
		if (!findItem) throw new ErrorResponse('Product not found', 400)

		if (payload.name) {
			payload.slug = slugify(payload.name, { lower: true })
		}

		findItem = await this.product.findByIdAndUpdate(productId, payload, {
			new: true,
			runValidators: true,
		})

		return { message: 'Product updated successfully' }
	}

	ReadAsAdmin = async () => {
		const filterParams = 'name images tagline slug created_at updated_at'
		const findList = await this.product
			.find({}, filterParams)
			.sort({ _id: -1 })
			.lean() // sorting for latest value, lean convert to Flat JS object
		if (findList.length === 0)
			throw new ErrorResponse('Product not found', 500)
		return findList
	}

	ReadAsUser = async () => {
		const filterParams = 'name images price slug created_at updated_at'
		const findList = await this.product
			.find({}, filterParams)
			.sort({ order_count: -1, average_rating: -1 })
			.lean() // sorting for highest no of views,order_count, to lowest number to display at homepage
		if (!findList || findList.length === 0)
			throw new ErrorResponse('Products not found', 400)
		return findList
	}

	ReadFromSlug = async slug => {
		const finder = await this.product.findOne({ slug }).lean()
		if (!finder) throw new ErrorResponse('Product not found', 400)

		const review = await this.review
			.find({ product: finder._id })
			.populate('product', 'name images')
			.lean()

		let avgRating = 0
		review.forEach(item => {
			avgRating += item.rating
		})
		avgRating = avgRating / review.length

		return {
			...finder,
			reviews: review,
			average_rating: avgRating ? avgRating : 5,
		}
	}
}

export default ProductService
