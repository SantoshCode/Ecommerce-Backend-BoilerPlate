import { Router } from 'express'
const router = Router()

// Auth Middleware
import { protect, authorize } from '../../middlewares/auth.js'

//Category controller
import {
	readAsAdmin,
	store,
	update,
	remove,
	readAsUser,
	readFromSlug,
} from './categoryController.js'

// Admin Routes
router.get('/admin/category', protect, authorize('ADMIN'), readAsAdmin)
router.post('/admin/category', protect, authorize('ADMIN'), store)
router.put('/admin/category/:catId', protect, authorize('ADMIN'), update)
router.delete('/admin/category/:catId', protect, authorize('ADMIN'), remove)

// User Routes, Logged in also not required
router.get('/category', readAsUser)
router.get('/category/:slug', readFromSlug)

export default router
