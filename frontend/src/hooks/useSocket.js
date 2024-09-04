import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5555'); // Ensure the URL matches your server

const useSocket = (onProductUpdate, onProductsFetched) => {
  useEffect(() => {
    socket.on('product-updated', onProductUpdate);
    socket.on('products-fetched', onProductsFetched);

    return () => {
      socket.off('product-updated', onProductUpdate);
      socket.off('products-fetched', onProductsFetched);
    };
  }, [onProductUpdate, onProductsFetched]);
};

export default useSocket;
