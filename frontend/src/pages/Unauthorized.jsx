import React from 'react';

const Unauthorized = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <div style={{ textAlign: 'center', backgroundColor: '#ffdddd', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ color: '#d9534f' }}>Unauthorized User</h1>
        <p style={{ color: '#d9534f' }}>You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default Unauthorized;
