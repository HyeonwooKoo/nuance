import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { SpeedInsights } from "@vercel/speed-insights/next"

import { Header } from '@/components/header';

const RootLayout = () => {
  return (
    <>
      <div>
        <Header />
        <Outlet />
      </div>
      <TanStackRouterDevtools />
      <SpeedInsights />
    </>
  );
};


export const Route = createRootRoute({ component: RootLayout })