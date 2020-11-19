import { Router } from 'express'
const router = Router()

// Auth Middleware
import { protect, authorize } from '../../middlewares/auth.js'

// controller
import { store, read } from './fileController.js'

// Admin Routes
router.post('/admin/upload', protect, authorize('ADMIN'), store)
router.get('/admin/files', protect, authorize('ADMIN'), read)

export default router
