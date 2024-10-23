import React, { useState, useEffect } from "react";
import { useTheme } from '../context/ThemeContext';
import { RiRefundLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RefundForm = ({ handleClose, transaction }) => {
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const [transactionId, setTransactionId] = useState(transaction.transaction_id);
    const [customer, setCustomer] = useState(transaction.customer?.name);
    const [email, setEmail] = useState(transaction.customer?.email);
    const [products, setProducts] = useState([]);
    const [SalesDate, setSalesDate] = useState(formatDate(transaction.transaction_date));
    const [transactionDate, setTransactionDate] = useState(transaction.transaction_date);
    const [phoneNumber, setPhoneNumber] = useState(transaction.customer?.phone);
    const [reasonForReturn, setReasonForReturn] = useState("");
    const [productCondition, setProductCondition] = useState("");
    const [notes, setNotes] = useState("");
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedSerial, setSelectedSerial] = useState("");
    const [cashierName, setCashierName] = useState(transaction.cashier || "");
    const [productWarranty, setProductWarranty] = useState("");

    const handleSubmit = async () => {

    }


    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <ToastContainer />

            <div className={`p-6 max-w-2xl w-full rounded-md shadow-md relative overflow-hidden overflow-y-auto ${darkMode ? "text-light-textPrimary bg-light-bg" : "text-dark-textPrimary bg-dark-bg"}`} style={{ maxHeight: "90%" }}>
                <div className="absolute top-2 right-2">
                    <button className="absolute top-2 right-4 text-black hover:text-gray-700" onClick={handleClose}>✖</button>
                </div>
                <h2 className={`text-2xl font-bold mb-6 flex items-center justify-center gap-4 border-b py-3 ${darkMode ? 'border-light-textSecondary' : 'border-dark-textSecondary'}`}>
                    <RiRefundLine />
                    <span>New RMA Request Form</span>
                </h2>

                <div className="flex flex-col gap-12 w-full">
                    <div className="flex flex-col gap-4 w-full">
                         <p className={`text-xl font-semibold mb-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            Transaction Detail
                        </p>
                        <div className="flex">
                            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</label>
                            <p className="w-[40%] font-semibold  p-1">
                                {transactionId}
                            </p>
                        </div>
                        <div className="flex">
                            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>SALE DATE</label>
                            <p className="w-[40%] font-semibold  p-1">
                                {SalesDate}
                            </p>
                        </div>                      
                        <div className="flex">
                            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CUSTOMER NAME</label>
                            <p className="w-[40%] font-semibold  p-1">
                                {transactionId}
                            </p>
                        </div>
                        <div className="flex">
                            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>CASHIER</label>
                            <p className="w-[40%] font-semibold  p-1">
                                {transactionId}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 w-full">
                         <p className={`text-xl font-semibold mb-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            Product Being Refunded
                        </p>
                        <div className="flex">
                            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</label>
                            <p className="w-[40%] font-semibold  p-1">
                                {transactionId}
                            </p>
                        </div>
                        <div className="flex">
                            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</label>
                            <p className="w-[40%] font-semibold  p-1">
                                {transactionId}
                            </p>
                        </div>                        <div className="flex">
                            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</label>
                            <p className="w-[40%] font-semibold  p-1">
                                {transactionId}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                         <p className={`text-xl font-semibold mb-2 ${darkMode ? 'text-light-textPrimary' : 'text-dark-textPrimary'}`}>
                            Product Being Refunded
                        </p>
                        <div className="flex">
                            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</label>
                            <p className="w-[40%] font-semibold  p-1">
                                {transactionId}
                            </p>
                        </div>
                        <div className="flex">
                            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</label>
                            <p className="w-[40%] font-semibold  p-1">
                                {transactionId}
                            </p>
                        </div>                        <div className="flex">
                            <label className={`font-medium w-[50%] ${darkMode ? 'text-light-textSecondary' : 'text-dark-textSecondary'}`}>TRANSACTION ID</label>
                            <p className="w-[40%] font-semibold  p-1">
                                {transactionId}
                            </p>
                        </div>
                    </div>
                </div>







                <button
                    onClick={handleSubmit}
                    className={`w-[49%] py-3 rounded-md font-semibold transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'bg-light-primary text-dark-textPrimary hover:bg-light-primary' : 'bg-dark-primary text-light-textPrimary hover:bg-dark-primary'}`}
                >
                    Confirm Request
                </button>

                <button
                    onClick={handleClose}
                    className={`w-[49%] py-3 bg-transparent border rounded-md transition-transform duration-200 transform hover:scale-105 ${darkMode ? 'border-light-primary text-light-primary' : 'border-dark-primary text-dark-primary'}`}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default RefundForm;
