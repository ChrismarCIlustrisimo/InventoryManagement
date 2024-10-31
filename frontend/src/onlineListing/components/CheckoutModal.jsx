import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useProductContext } from '../page';

const CheckoutModal = ({ isOpen, onRequestClose, items }) => {
    const navigate = useNavigate();
    const baseURL = "http://localhost:5555";
    const { cart ,setCart } = useProductContext(); // Get cart and setCart from context


    if (!isOpen) return null;

{/*    items.forEach(item => {
        console.log(item.quantity);
        item.units.forEach(unit => {
          console.log(unit);
        });
      }); */}
      
      console.log("CARTSSS",items);

      
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
        try {
            const fullName = `${customer.firstName} ${customer.lastName}`;
            const fullAddress = `${customer.address.streetAddress}, ${customer.address.city}, ${customer.address.province}`;
            const customerResponse = await axios.post(`${baseURL}/customer`, {
                name: fullName,
                email: customer.email,
                phone: customer.phone,
                address: fullAddress,
            });

            const customerId = customerResponse.data._id;

            const transactionData = {
                products: items.map(item => {
                    const availableUnits = item.units.filter(unit => unit.status === 'in_stock');
                    const requestedQuantity = Math.min(item.quantity, availableUnits.length);

                    return {
                        product: item._id,
                        quantity: requestedQuantity, // Use the requested quantity of available units
                        product_name: item.name,
                        serial_number: availableUnits.slice(0, requestedQuantity).map(unit => unit.serial_number), // Adjusted logic
                    };
                }),
                customer: customerId,
                total_price: total,
                total_amount_paid: 0,
                transaction_date: new Date().toISOString(),
                cashier: '',
                payment_status: 'unpaid',
                status: 'Reserved',
                vat: 0,
                discount: 0,
                payment_method: 'None',
            };
            
            // Prepare serial numbers for updating stock
            const serialNumbersToUpdate = transactionData.products.flatMap(product => product.serial_number);
            if (!serialNumbersToUpdate.length) throw new Error('No serial numbers available for update.');

            const transactionResponse = await axios.post(`${baseURL}/transaction/online-reservation`, transactionData);
            const transactionId = transactionResponse.data._id;
            const transaction_Id = transactionResponse.data.transaction_id;

            // Update the stock by serial number
            const updates = items.map(item => {
                const availableUnits = item.units.filter(unit => unit.status === 'in_stock');
                const requestedQuantity = Math.min(item.quantity, availableUnits.length);
                return {
                    updateOne: {
                        filter: { 'units.serial_number': { $in: availableUnits.slice(0, requestedQuantity).map(unit => unit.serial_number) } },
                        update: { $inc: { sales: requestedQuantity } }, // Update the sales count
                    },
                };
            });
            await axios.put(`${baseURL}/product/bulk-update`, updates);

            // Clear cart from local storage
            localStorage.removeItem('cart'); // Remove cart from local storage
            setCart([]); // Clear the cart in context

            navigate('/Ereceipt', { state: { transaction: transactionData, transactionId, transaction_Id, total } });
            onRequestClose();
        } catch (error) {
            console.error('Payment error:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black opacity-50 absolute inset-0"></div>
            <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-[50%] relative z-10 text-black">
                <button className="text-blue-500 mb-4" onClick={onRequestClose}>
                    &lt; Return to Cart
                </button>
                <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
                <form className="grid grid-cols-2 gap-4">
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
                        className="col-span-2 border p-2 rounded"
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
                        className="col-span-2 border p-2 rounded"
                        value={customer.phone}
                        onChange={handleCustomerChange}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        name="email"
                        className="col-span-2 border p-2 rounded"
                        value={customer.email}
                        onChange={handleCustomerChange}
                    />
                </form>

                <h2 className="text-xl font-semibold mt-6 mb-4">Items To Reserve</h2>
                <table className="w-full text-left border border-gray-300 mb-4">
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
                                <td className="p-2 border-b flex gap-2 items-center justify-start">
                                    <img src={`${baseURL}/${item.image}`} alt={item.name} className="w-24 h-24 object-cover" />
                                    <p className="p-2 border-b">{item.name}</p>
                                </td>
                                <td className="p-2 border-b text-red-500 font-bold text-center">₱{item.selling_price.toLocaleString()}</td>
                                <td className="p-2 border-b text-center">{item.quantity}</td>
                                <td className="p-2 border-b text-red-500 font-bold text-center">₱{(item.selling_price * item.quantity).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-between mb-2">
                    <p>Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</p>
                    <p>₱{total.toLocaleString()}</p>
                </div>

                <div className="flex justify-between text-red-500 font-bold text-xl mb-4">
                    <p>Total</p>
                    <p>₱{total.toLocaleString()}</p>
                </div>

                <button
                    className="bg-blue-500 text-white w-full py-2 rounded-lg"
                    onClick={handleConfirmReservation}

                >
                    Confirm Reservation
                </button>

                
            </div>
        </div>
    );
};

export default CheckoutModal;
