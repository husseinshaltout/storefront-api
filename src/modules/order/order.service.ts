import { Order } from './interface/order.interface';
import orderRepository from './order.repository';

class OrderService {
    async getAllOrders() {
        try {
            return await orderRepository.getAll();
        } catch (error) {
            throw new Error(`Unable to get all orders: ${error}`);
        }
    }

    async getOrderById(id: number) {
        try {
            return await orderRepository.getOrderById(id);
        } catch (error) {
            throw new Error(`Unable to get order with id ${id}: ${error}`);
        }
    }

    async create(order: Order) {
        try {
            const newOrder = await orderRepository.create(order);

            return newOrder;
        } catch (error) {
            throw new Error(`Unable to create order: ${error}`);
        }
    }

    async update(order: Order) {
        try {
            const newOrder = await orderRepository.update(order);
            return newOrder;
        } catch (error) {
            throw new Error(`Unable to update order: ${error}`);
        }
    }

    async currentOrder(userId: string) {
        try {
            const order = await orderRepository.currentOrder(userId);
            return order;
        } catch (error) {
            throw new Error(`Unable to get current order: ${error}`);
        }
    }

    async completedOrders(userId: string) {
        try {
            const orders = await orderRepository.completedOrders(userId);
            return orders;
        } catch (error) {
            throw new Error(`Unable to get completed orders: ${error}`);
        }
    }

    async orderDetails(id: number) {
        try {
            const order = await orderRepository.orderDetails(id);
            return order;
        } catch (error) {
            throw new Error(`Unable to get order details: ${error}`);
        }
    }
}

const orderService = new OrderService();
export default orderService;
