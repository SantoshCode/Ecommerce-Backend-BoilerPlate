import { Container } from 'typedi'

import ProductService from './productService.js'
const ProductServiceInstance = Container.get(ProductService)

// Middlewares
import ErrorResponse from '../../utils/errorResponse.js'
import asyncHandler from '../../middlewares/async.js'

export const store = asyncHandler(async (req, res) => {
	const { name, images, category, price, search_tags } = req.body
	if (!name || !images || !category || !price || !search_tags)
		throw new ErrorResponse(
			'Required fields name, images, category, price, search_tags',
			400
		)
	const response = await ProductServiceInstance.Store({
		name,
		images,
		category,
		price,
		search_tags,
	})
	res.json(response)
})

export const update = asyncHandler(async (req, res) => {
	const { productId } = req.params

	const response = await ProductServiceInstance.Update(productId, req.body) // we directly pass req body because we dont know what will be update value comming to validate
	res.json(response)
})

export const remove = asyncHandler(async (req, res) => {
	const { productId } = req.params

	const response = await ProductServiceInstance.Delete(productId)
	res.json(response)
})

export const readAsAdmin = asyncHandler(async (req, res) => {
	const response = await ProductServiceInstance.ReadAsAdmin()
	res.json(response)
})

export const readAsUser = asyncHandler(async (req, res) => {
	const response = await ProductServiceInstance.ReadAsUser()
	res.json(response)
})

export const readFromSlug = asyncHandler(async (req, res) => {
	const { slug } = req.params

	const response = await ProductServiceInstance.ReadFromSlug(slug)
	res.json(response)
})
