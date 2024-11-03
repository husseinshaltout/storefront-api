import { Request, Response } from 'express';
import { Order } from './interface/order.interface';
import orderService from './order.service';

class OrderController {
    async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await orderService.getAllOrders();
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: `Unable to get all orders: ${error}` });
        }
    }

    async getOrderById(req: Request, res: Response) {
        const orderId = parseInt(req.params.id, 10);
        try {
            const order = await orderService.getOrderById(orderId);
            res.status(200).json(order);
        } catch (error) {
            console.error(error);
            res.status(404).json({ message: `Order not found: ${error}` });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const order: Order = {
                user_id: req.user?.id.toString(),
                status: req.body?.status
            };

            const newOrder = await orderService.create(order);
            res.status(201).json(newOrder);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: `Unable to create order: ${error}` });
        }
    }

    async update(req: Request, res: Response) {
        const order: Order = {
            id: parseInt(req.params.id, 10),
            user_id: req.user?.id.toString(),
            status: req.body?.status
        };

        try {
            const updatedOrder = await orderService.update(order);
            res.status(200).json(updatedOrder);
        } catch (error) {
            console.error(error);
            res.status(400).json({ message: `Unable to update order: ${error}` });
        }
    }

    async currentOrder(req: Request, res: Response) {
        const userId = req.body?.user_id;

        try {
            const order = await orderService.currentOrder(userId);
            res.status(200).json(order);
        } catch (error) {
            console.error(error);
            res.status(404).json({ message: `Unable to get current order: ${error}` });
        }
    }

    async completedOrders(req: Request, res: Response) {
        const userId = req.body?.user_id;

        try {
            const orders = await orderService.completedOrders(userId);
            res.status(200).json(orders);
        } catch (error) {
            console.error(error);
            res.status(404).json({ message: `Unable to get completed orders: ${error}` });
        }
    }

    async orderDetails(req: Request, res: Response) {
        const orderId = parseInt(req.params.id, 10);

        try {
            const order = await orderService.orderDetails(orderId);
            res.status(200).json(order);
        } catch (error) {
            console.error(error);
            res.status(404).json({ message: `Unable to get order details: ${error}` });
        }
    }
}

const orderController = new OrderController();

export default orderController;
