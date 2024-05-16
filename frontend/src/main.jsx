import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthProvider.jsx';
import App from './App.jsx';
import './index.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
      </AuthProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
