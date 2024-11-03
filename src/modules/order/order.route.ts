import { Router } from 'express';
import verifyAuthToken from '../../middleware/authTokenVerification';
import orderController from './order.controller';

class OrderRouter {
    public router = Router();
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(
            '/cart',
            verifyAuthToken,
            orderController.currentOrder.bind(orderController)
        );
        this.router.get(
            '/complete',
            verifyAuthToken,
            orderController.completedOrders.bind(orderController)
        );
        this.router.get('/details/:id', orderController.orderDetails.bind(orderController));
        this.router.get('/', orderController.getAllOrders.bind(orderController));
        this.router.get('/:id', orderController.getOrderById.bind(orderController));
        this.router.post('/', verifyAuthToken, orderController.create.bind(orderController));
        this.router.patch('/:id', verifyAuthToken, orderController.update.bind(orderController));
    }
}

const orderRouter = new OrderRouter();
export default orderRouter;
