"use client";

import React from 'react';
import { Provider } from 'react-redux'
import store from './index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function ReduxProvider({ children }) {
  const client = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={client}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}
