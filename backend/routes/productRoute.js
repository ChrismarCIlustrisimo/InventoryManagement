import express from 'express';
import Product from '../models/productModel.js';

const router = express.Router();


//Add Product
router.post('/', async (request, response) => {
    try {
  
      const { name, category, in_stock, supplier, product_id, buyin_price, selling_price, image } = request.body;
  
  
      if (!name || !category || in_stock === undefined ||
          !supplier || !product_id || buyin_price === undefined ||
          selling_price === undefined || !image) {
        return response.status(400).send({
          message: 'All fields are required'
        });
      }
  
      const newProduct = new Product({
          name: request.body.name,
          category: request.body.category,
          in_stock: request.body.in_stock,
          supplier: request.body.supplier,
          product_id: request.body.product_id,
          buyin_price: request.body.buyin_price,
          selling_price: request.body.selling_price,
          image: request.body.image
        });
        
        const product = await Product.create(newProduct);
        return response.status(201).send(product);
  
    } catch (error) {
      console.error(error);
      return response.status(500).send('Server Error');
    }
  });
  
  //Get All Products
  router.get('/', async (request, response) => {
      try {
        const product = await Product.find({});
        return response.status(200).json({
          count: product.length,
          data: product
        });
  
      } catch (error) {
        console.error(error);
        return response.status(500).send('Server Error');
      }
    });
  
  //Get Single Product
  router.get('/:id', async (request, response) => {
      try {
          const { id } = request.params;
  
        const product = await Product.findById(id);
        return response.status(200).json(product);
  
      } catch (error) {
        console.error(error);
        return response.status(500).send('Server Error');
      }
    });
  
  //Update Product
  router.put('/:id', async (request, response) => {
      try {
        const { name, category, in_stock, supplier, product_id, buyin_price, selling_price, image } = request.body;
    
        if (!name || !category || in_stock === undefined || !supplier || !product_id || buyin_price === undefined || selling_price === undefined || !image) {
          return response.status(400).send({ message: 'All fields are required' });
        }
        
        const { id } = request.params;
        const result = await Product.findByIdAndUpdate(id, request.body);
    
        // Check if product was found and updated
        if (!result) {
          return response.status(404).json({ message: 'Product not found' });
        }
    
        return response.status(200).send({ message: 'Product updated' });
      } catch (error) {
        // Handle any errors that occur during update
        console.error(error);
        return response.status(500).send('Server Error');
      }
    });
  
  //Delete Product
  router.delete('/:id',  async (request, response) => {
      try {
          const { id } = request.params;
          const result = await Product.findByIdAndDelete(id);
  
          if(!result){
              return response.status(404).json({ message: 'Product not found' });
          }
  
          return response.status(200).json({ message: 'Product deleted Sucessfully' });
      }catch (error) {
          console.error(error);
          return response.status(500).send('Server Error');
      }
  })
    

  export default router;

// Product Model