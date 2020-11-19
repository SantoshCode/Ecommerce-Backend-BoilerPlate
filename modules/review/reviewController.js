import { Container } from 'typedi'
import ReviewService from './reviewService.js'
import ErrorResponse from '../../utils/errorResponse.js'
import asyncHandler from '../../middlewares/async.js'
const ReviewServiceInstance = Container.get(ReviewService)

export const store = asyncHandler(async (req, res) => {
	const { review, rating, product } = req.body
	const userId = req.payload._id
	if (!review || !rating || !product)
		throw new ErrorResponse('Required fields review, rating, product', 400)
	const response = await ReviewServiceInstance.store(req.body, userId)
	res.json(response)
})

export const readAll = asyncHandler(async (req, res) => {
	const response = await ReviewServiceInstance.read()
	res.json(response)
})

export const remove = asyncHandler(async (req, res) => {
	const { id } = req.params
	const response = await ReviewServiceInstance.remove(id)
	res.json(response)
})
