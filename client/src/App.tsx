import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LoginPage from "@/routers/login/page";
import LogoutPage from "@/routers/logout";
import MainPage from "@/routers/main-page";
import OnBoardingPage from "@/routers/on-boarding";
import RegisterPage from "@/routers/register/page";
import LayoutPage from "@/components/layout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutPage />,
      children: [
        {
          path: "/",
          element:  <MainPage />
        },
        {
          path: "/login",
          element:  <LoginPage />
        },
        {
          path: "/register",
          element: <RegisterPage />
        },
        {
          path: "/logout",
          element:  <LogoutPage />
        },
        {
          path: "/on-boarding",
          element:  <OnBoardingPage />
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />
}

export default App;
