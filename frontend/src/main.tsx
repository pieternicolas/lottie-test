import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import router from './routes';

import '~/assets/styles/index.css';

const queryClient = new QueryClient();
const graphqlClient = new ApolloClient({
  uri: import.meta.env.VITE_LOTTIE_PUBLIC_URL,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={graphqlClient}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
