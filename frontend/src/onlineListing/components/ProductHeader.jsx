import React from 'react'

const ProductHeader = ({ header }) => {
      return (

            <h1 className="text-6xl p-12 text-white font-bold mb-4" style={{ background: 'linear-gradient(to right, #E84C19, white)' }}>{header}</h1>
      )
}

export default ProductHeader