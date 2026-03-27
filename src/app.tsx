import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router';
import { client } from './client';
import { router } from './router';
import { theme } from './theme';

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools />
      <MantineProvider theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>
    </QueryClientProvider>
  );
}
