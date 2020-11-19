import { Container } from 'typedi'
import asyncHandler from '../../middlewares/async.js'
import ErrorResponse from '../../utils/errorResponse.js'
import CategoryService from './categoryService.js'
const CategoryServiceInstance = Container.get(CategoryService)

export const store = asyncHandler(async (req, res) => {
	const { name, tagline, images } = req.body
	if (!name || !tagline || !images)
		throw new ErrorResponse('Required fields name, tagline, images', 400)
	const response = await CategoryServiceInstance.Store({
		name,
		tagline,
		images,
	})
	res.json(response)
})

export const update = asyncHandler(async (req, res) => {
	const { catId } = req.params
	const response = await CategoryServiceInstance.Update(catId, req.body) // we directly pass req body because we dont know what will be update value comming to validate
	res.json(response)
})

export const remove = asyncHandler(async (req, res) => {
	const { catId } = req.params
	const response = await CategoryServiceInstance.Delete(catId)
	res.json(response)
})

export const readAsAdmin = asyncHandler(async (req, res) => {
	const response = await CategoryServiceInstance.ReadAsAdmin()
	res.json(response)
})

export const readAsUser = asyncHandler(async (req, res) => {
	const response = await CategoryServiceInstance.ReadAsUser()
	res.json(response)
})

export const readFromSlug = asyncHandler(async (req, res) => {
	const { slug } = req.params
	const response = await CategoryServiceInstance.ReadFromSlug(slug)
	res.json(response)
})
