import express from 'express';
import Customer from '../models/customerModel.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// requireAuth for all customer routes
//router.use(requireAuth)

// Add Customer
router.post('/', async (request, response) => {
    try {
        const { name, email, phone, address } = request.body;

        const newCustomer = new Customer({ name, email, phone, address });
        const customer = await Customer.create(newCustomer);
        return response.status(201).send(customer);

    } catch (error) {
        console.error(error);
        return response.status(500).send('Server Error');
    }
});

// Get All Customers
router.get('/', async (request, response) => {
    try {
        const customers = await Customer.find({});
        return response.status(200).json({ count: customers.length, data: customers });

    } catch (error) {
        console.error(error);
        return response.status(500).send('Server Error');
    }
});

// Get Single Customer
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const customer = await Customer.findById(id);
        return response.status(200).json(customer);

    } catch (error) {
        console.error(error);
        return response.status(500).send('Server Error');
    }
});

// Update Customer
router.put('/:id', async (request, response) => {
    try {
        const { name, email, phone, address } = request.body;

        if (!name || !email || !phone || !address) {
            return response.status(400).send({ message: 'All fields are required' });
        }

        const { id } = request.params;
        const result = await Customer.findByIdAndUpdate(id, request.body, { new: true });

        if (!result) {
            return response.status(404).json({ message: 'Customer not found' });
        }

        return response.status(200).send({ message: 'Customer updated', data: result });
    } catch (error) {
        console.error(error);
        return response.status(500).send('Server Error');
    }
});

// Delete Customer
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Customer.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Customer not found' });
        }

        return response.status(200).json({ message: 'Customer deleted Successfully' });
    } catch (error) {
        console.error(error);
        return response.status(500).send('Server Error');
    }
});

export default router;
