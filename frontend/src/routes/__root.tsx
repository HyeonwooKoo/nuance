import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Header } from '@/components/header';

const RootLayout = () => {
  return (
    <>
      <div>
        <Header />
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  );
};


export const Route = createRootRoute({ component: RootLayout })