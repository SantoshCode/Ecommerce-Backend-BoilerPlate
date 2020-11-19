import { Router } from 'express'

export default async () => {
	const app = Router()
	app.use((await import('../modules/auth/authRoutes.js')).default)
	app.use((await import('../modules/product/productRoutes.js')).default)
	app.use((await import('../modules/review/reviewRoutes.js')).default)
	app.use((await import('../modules/category/categoryRoutes.js')).default)
	app.use((await import('../modules/order/orderRoutes.js')).default)
	app.use((await import('../modules/file/fileRoutes.js')).default)
	return app
}
