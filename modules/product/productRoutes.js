import { Router } from 'express'
const router = Router()
import { protect, authorize } from '../../middlewares/auth.js'

import {
	readAsUser,
	readFromSlug,
	readAsAdmin,
	store,
	update,
	remove,
} from './productController.js'

// User routes
router.get('/products', readAsUser)
router.get('/products/:slug', readFromSlug)

// Admin Routes
router.get('/admin/products', protect, authorize('ADMIN'), readAsAdmin)
router.post('/admin/products', protect, authorize('ADMIN'), store)
router.put('/admin/products/:productId', protect, authorize('ADMIN'), update)
router.delete('/admin/products/:productId', protect, authorize('ADMIN'), remove)

export default router
