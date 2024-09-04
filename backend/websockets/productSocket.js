export default function productSocket(io, socket) {
  // Listen for product updates
  socket.on('update-product', async (updatedProduct) => {
    io.emit('product-updated', updatedProduct);
  });

  socket.on('add-product', async (product) => {
    io.emit('product-added', product);
  });
}
