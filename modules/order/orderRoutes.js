import { Router } from 'express'

const router = Router({ mergeParams: true })
// Auth Middleware
import { protect, authorize } from '../../middlewares/auth.js'

// Food controller
import { store, readMine } from './orderController.js'

// user order routes
router.route('/order').post(protect, store).get(protect, readMine)

export default router
