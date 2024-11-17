import { useEffect } from 'react';
import io from 'socket.io-client';
import { API_DOMAIN } from "../utils/constants";

const socket = io(API_DOMAIN); // Ensure the URL matches your server

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
