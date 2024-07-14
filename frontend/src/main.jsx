import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import AuthProvider from './context/AuthProvider.jsx';
import './index.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ThemeProvider } from '@material-tailwind/react';

const queryClient = new QueryClient();

const theme = {
  button: {
    defaultProps: {
      className: 'font-normal !justify-center !normal-case rounded-[3px]',
    },
  },
  checkbox: {
    defaultProps: {
      className: 'w-6 h-6 !rounded-[4px] before:hidden border-2',
    },
    styles: {
      colors: {
        blue: {
          background: 'checked:bg-blue-300',
          border: 'checked:border-blue-300',
          before: 'checked:before:bg-blue-300',
        },
      },
    },
  },
  input: {
    defaultProps: {
      className: '!rounded-[3px]',
    },
  },
  select: {
    defaultProps: {
      className: 'rounded-[3px]',
    },
  },
  option: {
    defaultProps: {
      className: 'rounded-[3px]',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={theme}>
          <App />
        </ThemeProvider>
        <ReactQueryDevtools />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
