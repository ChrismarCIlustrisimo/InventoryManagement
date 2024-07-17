import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PosHome from './pages/PosHome.jsx'
import PosLogin from './pages/PosLogin.jsx'
import SalesOrder from './pages/SalesOrder.jsx'
import Transaction from './pages/Transaction.jsx'

const App = () => {
  return (
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/pos" element={<PosHome />} />
          <Route path="/orders" element={<SalesOrder />} />
          <Route path="/login" element={<PosLogin />} />
          <Route path="/transaction" element={<Transaction />} />
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
  )
}

export default App
