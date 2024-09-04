export default function transactionSocket(io, socket) {
    socket.on('transaction-completed', (data) => {
      console.log('Transaction completed:', data);
      io.emit('transaction-update', data); // Notify all clients about the completed transaction
    });
  }
  