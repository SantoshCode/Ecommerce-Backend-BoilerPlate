import { Router } from 'express'
const router = Router()
import { protect, authorize } from '../../middlewares/auth.js'
import {
	register,
	login,
	logout,
	adminLogin,
	adminLogout,
	currentUser,
	currentAdmin,
} from './authController.js'

// User Authentication
router.post('/register', register)
router.post('/login', login)

router.get('/me', protect, currentUser)
router.get('/logout', logout)
// Admin authentication
router.post('/admin/login', adminLogin)
router.get('/admin/me', protect, authorize('ADMIN'), currentAdmin)
router.get('/admin/logout', adminLogout)

export default router
