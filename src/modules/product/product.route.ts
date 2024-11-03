import { Router } from 'express';
import verifyAuthToken from '../../common/middleware/authTokenVerification';
import productController from './product.controller';

class ProductRouter {
    public router = Router();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', productController.getAllProducts.bind(productController));
        this.router.get('/:id', productController.getProductById.bind(productController));
        this.router.post('/', verifyAuthToken, productController.create.bind(productController));
        this.router.get(
            '/categories/:category',
            productController.showByCategory.bind(productController)
        );
    }
}

const productRouter = new ProductRouter();
export default productRouter;
