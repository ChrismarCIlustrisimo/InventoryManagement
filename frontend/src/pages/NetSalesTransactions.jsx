// NetSalesTransactions.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../hooks/useAuthContext';
import { useAdminTheme } from '../context/AdminThemeContext';

const NetSalesTransactions = () => {

    const { darkMode } = useAdminTheme();
  const { user } = useAuthContext();
  const baseURL = "http://localhost:5555";
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${baseURL}/transaction`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTransactions(response.data.data); // Adjust based on your API response
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (user.token) {
      fetchTransactions();
    }
  }, [user.token]);

  return (
    <div className={`${darkMode ? "text-light-textPrimary" : "dark:text-dark-textPrimary"}`}>
      <h1>Net Sales Transactions</h1>
      {transactions.length === 0 ? (
        <p>No transactions available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.transaction_id}</td>
                <td>{new Date(transaction.transaction_date).toLocaleDateString()}</td>
                <td>{transaction.customer ? transaction.customer.name : "None"}</td>
                <td>₱ {transaction.total_price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default NetSalesTransactions;
