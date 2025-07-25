import React from 'react';
import RouterWrapper from './router/RouterWrapper';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <>
      <RouterWrapper />
      <Toaster position="top-right" />
    </>
  );
};

export default App;
