import { Router } from 'express'
const router = Router({ mergeParams: true })

// Auth Middleware
import { protect, authorize } from '../../middlewares/auth.js'

// Priduct controller
import { store, remove, readAll } from './reviewController.js'

// user review routes
router.route('/reviews').post(protect, store)

// Admin routes
router.route('/admin/reviews/:id').delete(protect, authorize('ADMIN'), remove)
router.route('/admin/reviews').get(protect, authorize('ADMIN'), readAll)

export default router
