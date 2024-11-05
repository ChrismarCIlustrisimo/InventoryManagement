import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast
import { useProductContext } from '../page';

const CheckoutModal = ({ isOpen, onRequestClose, items }) => {
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";
    const { cart, setCart } = useProductContext(); // Get cart and setCart from context

    if (!isOpen) return null;

    // State variable for customer details
    const [customer, setCustomer] = useState({
        firstName: '',
        lastName: '',
        address: {
            streetAddress: '',
            city: '',
            province: '',
        },
        phone: '',
        email: '',
    });

    const total = items.reduce((acc, item) => {
        const price = Number(item.selling_price) || 0;
        const quantity = Number(item.quantity) || 0;
        return acc + price * quantity;
    }, 0);

    // Calculate VAT
    const totalVat = items.reduce((acc, item) => {
        const price = Number(item.selling_price) || 0;
        return acc + (price * 0.12); // Calculate VAT for each item
    }, 0);

    const handleCustomerChange = (e) => {
        const { name, value } = e.target;
        if (name in customer) {
            setCustomer((prevCustomer) => ({
                ...prevCustomer,
                [name]: value,
            }));
        } else {
            setCustomer((prevCustomer) => ({
                ...prevCustomer,
                address: {
                    ...prevCustomer.address,
                    [name]: value,
                },
            }));
        }
    };

    const handleConfirmReservation = async () => {
        // Validate customer information
        const { firstName, lastName, phone, email, address } = customer;

        if (!firstName.trim()) {
            toast.warning('Please enter your first name.');
            return;
        }
        if (!lastName.trim()) {
            toast.warning('Please enter your last name.');
            return;
        }
        if (!address.streetAddress.trim()) {
            toast.warning('Please enter your street address.');
            return;
        }
        if (!address.city.trim()) {
            toast.warning('Please enter your city.');
            return;
        }
        if (!address.province.trim()) {
            toast.warning('Please enter your province.');
            return;
        }
        if (!validatePhoneNumber(phone)) {
            toast.warning('Please enter a valid phone number (e.g., 09854875843).');
            return;
        }
        if (!validateEmail(email)) {
            toast.warning('Please enter a valid email address (e.g., chris@gmail.com).');
            return;
        }

        try {
            const fullName = `${firstName} ${lastName}`;
            const fullAddress = `${address.streetAddress}, ${address.city}, ${address.province}`;
            const customerResponse = await axios.post(`${baseURL}/customer`, {
                name: fullName,
                email: email,
                phone: phone,
                address: fullAddress,
            });

            const customerId = customerResponse.data._id;

            const transactionData = {
                products: items.map(item => {
                    const availableUnits = item.units.filter(unit => unit.status === 'in_stock');
                    const requestedQuantity = Math.min(item.quantity, availableUnits.length);

                    return {
                        product: item._id,
                        quantity: requestedQuantity,
                        product_name: item.name,
                        serial_number: availableUnits.slice(0, requestedQuantity).map(unit => unit.serial_number),
                    };
                }),
                customer: customerId,
                total_price: total,
                total_amount_paid: 0,
                transaction_date: new Date().toISOString(),
                cashier: '',
                payment_status: 'unpaid',
                status: 'Reserved',
                vat: totalVat,
                discount: 0,
                payment_method: 'None',
            };

            const serialNumbersToUpdate = transactionData.products.flatMap(product => product.serial_number);
            if (!serialNumbersToUpdate.length) throw new Error('No serial numbers available for update.');

            const transactionResponse = await axios.post(`${baseURL}/transaction/online-reservation`, transactionData);
            const transactionId = transactionResponse.data._id;
            const transaction_Id = transactionResponse.data.transaction_id;

            const updates = items.map(item => {
                const availableUnits = item.units.filter(unit => unit.status === 'in_stock');
                const requestedQuantity = Math.min(item.quantity, availableUnits.length);
                return {
                    updateOne: {
                        filter: { 'units.serial_number': { $in: availableUnits.slice(0, requestedQuantity).map(unit => unit.serial_number) } },
                        update: { $inc: { sales: requestedQuantity } },
                    },
                };
            });
            await axios.put(`${baseURL}/product/bulk-update`, updates);

            localStorage.removeItem('cart');
            setCart([]);
            navigate('/Ereceipt', { state: { transaction: transactionData, transactionId, transaction_Id, total, totalVat } });
            onRequestClose();
        } catch (error) {
            console.error('Payment error:', error.response ? error.response.data : error.message);
        }
    };

    return (
            <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
                <div className="bg-black opacity-50 absolute inset-0"></div>
                <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-[90%] sm:max-w-[50%] relative z-10 text-black overflow-y-auto max-h-screen">
                    <button className="text-blue-500 mb-4" onClick={onRequestClose}>
                        &lt; Return to Cart
                    </button>
                    <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
                    <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            className="border p-2 rounded"
                            value={customer.firstName}
                            onChange={handleCustomerChange}
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            name="lastName"
                            className="border p-2 rounded"
                            value={customer.lastName}
                            onChange={handleCustomerChange}
                        />
                        <input
                            type="text"
                            placeholder="Street Address"
                            name="streetAddress"
                            className="col-span-1 sm:col-span-2 border p-2 rounded"
                            value={customer.address.streetAddress}
                            onChange={handleCustomerChange}
                        />
                        <input
                            type="text"
                            placeholder="City"
                            name="city"
                            className="border p-2 rounded"
                            value={customer.address.city}
                            onChange={handleCustomerChange}
                        />
                        <input
                            type="text"
                            placeholder="Province"
                            name="province"
                            className="border p-2 rounded"
                            value={customer.address.province}
                            onChange={handleCustomerChange}
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            name="phone"
                            className="col-span-1 sm:col-span-2 border p-2 rounded"
                            value={customer.phone}
                            onChange={handleCustomerChange}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            className="col-span-1 sm:col-span-2 border p-2 rounded"
                            value={customer.email}
                            onChange={handleCustomerChange}
                        />
                    </form>

                    <h2 className="text-xl font-semibold mt-6 mb-4">Items To Reserve</h2>

                    {/* Render product items as a responsive div layout on mobile */}
                    <div className="space-y-4 sm:hidden">
                        {items.map((item) => (
                            <div key={item._id} className="flex flex-col gap-2 border-b pb-4">
                                <div className="flex items-start gap-2">
                                    <img src={`${baseURL}/${item.image}`} alt={item.name} className="w-24 h-24 object-cover" />
                                    <p className="font-semibold">{item.name}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p>Price:</p>
                                    <p className="text-red-500 font-bold">₱{item.selling_price.toLocaleString()}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p>Quantity:</p>
                                    <p>{item.quantity}</p>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <p>Total:</p>
                                    <p className="text-red-500 font-bold">₱{(item.selling_price * item.quantity).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Render as table for larger screens */}
                    <table className="hidden sm:table w-full text-left border border-gray-300 mb-4">
                        <thead>
                            <tr>
                                <th className="p-2 border-b">Product</th>
                                <th className="p-2 border-b">Price</th>
                                <th className="p-2 border-b">Quantity</th>
                                <th className="p-2 border-b">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item._id}>
                                    <td className="p-2 border-b flex gap-2 items-center">
                                        <img src={`${baseURL}/${item.image}`} alt={item.name} className="w-24 h-24 object-cover" />
                                        <p className="p-2">{item.name}</p>
                                    </td>
                                    <td className="p-2 border-b text-red-500 font-bold text-center">₱{item.selling_price.toLocaleString()}</td>
                                    <td className="p-2 border-b text-center">{item.quantity}</td>
                                    <td className="p-2 border-b text-red-500 font-bold text-center">₱{(item.selling_price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-between mb-2 text-sm sm:text-base">
                        <p>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</p>
                        <p>₱{total.toLocaleString()}</p>
                    </div>

                    <div className="flex justify-between text-red-500 font-bold text-lg sm:text-xl mb-4">
                        <p>Total</p>
                        <p>₱{(total + totalVat).toLocaleString()}</p>
                    </div>

                    <button className="bg-blue-500 text-white w-full py-2 rounded-lg" onClick={handleConfirmReservation}>
                        Confirm Reservation
                    </button>
                </div>
            </div>


    );
};

// Validation functions for phone and email
const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{11}$/; // Adjust regex as needed for phone format
    return phoneRegex.test(phone);
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
    return emailRegex.test(email);
};

export default CheckoutModal;
