import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { routeTree } from './routeTree.gen.ts'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import './index.css'

import { OAuthProvider } from './components/providers/auth-provider.tsx'
import { ThemeProvider } from './components/providers/theme-provider.tsx'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <OAuthProvider>
        <RouterProvider router={router} />
      </OAuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
