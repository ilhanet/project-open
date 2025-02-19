import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './components/i18n/index.js'
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <QueryClientProvider client={queryClient}>
      <App />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
)
