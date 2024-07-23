import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PosHome from './pages/PosHome.jsx'
import PosLogin from './pages/PosLogin.jsx'
import SalesOrder from './pages/SalesOrder.jsx'
import Transaction from './pages/Transaction.jsx'
import AddProduct from './components/AddProduct.jsx'
import SignUp from './pages/SignUp.jsx'
import { useAuthContext } from './hooks/useAuthContext.js'

const App = () => {
  
  const { user } = useAuthContext()

  return (
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/transaction/:id" element={user ? <Transaction /> : <Navigate to='/login' />} />
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/pos" element={user ? <PosHome /> : <Navigate to='/login' />} /> {/*This will check if the user is login or not */}
          <Route path="/orders" element={user ? <SalesOrder /> : <Navigate to='/login' />} />
          <Route path="/login" element={!user ? <PosLogin /> : <Navigate to='/pos'/>} />
         {/*<Route path="/transaction" element={<Transaction />} />*/}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
  )
}

export default App
