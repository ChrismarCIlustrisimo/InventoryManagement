export default function customerSocket(io, socket) {
    socket.on('customer-registered', (data) => {
      console.log('Customer registered:', data);
      io.emit('customer-status', data); // Notify all clients about the new customer
    });
  }
  