import React, { useEffect, useState } from "react";

import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Outlet } from "react-router-dom";
import LoginPage from "./pages/login/login";
import ContactPage from "./pages/contact";
import BookPage from "./pages/book";
import Header from "./components/Header/header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import RegisterPage from "./pages/register";
import { useDispatch, useSelector } from "react-redux";
import { callGetAccount } from "./services/api";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading/loading";
import Notfound from "./components/Notfound";
import ManagerUser from "./pages/admin/managerUser/ManagerUser";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import ManagerBook from "./pages/admin/managerBook/ManagerBook";
import { ConfigProvider } from "antd";

const Layout = () => {
  const role = useSelector((state) => state.account?.user?.role);
  const navigate = useNavigate();
  const location = useLocation();
  const prevUrl = location.state?.from?.pathname.startsWith('/admin')
  useEffect(() => {
    if (role && role === "ADMIN" && prevUrl !==true) {
      navigate("/admin/dashboard")
    }
  }, []);

  return (
    <div className="layout-app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.account.isLoading);
  const getAccount = async () => {
    let res = await callGetAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data));
    }
  };

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      getAccount();
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <Notfound />,
      children: [
        { index: true, element: <Home /> },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "book",
          element: (
            <ProtectedRoute>
              <BookPage />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/admin",
      element: (
        <ProtectedRoute>
          <LayoutAdmin />
        </ProtectedRoute>
      ),
      errorElement: <Notfound />,
      children: [
        {
          index: true,
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "user",
          element: <ManagerUser />,
        },
        {
          path: "book",
          element: <ManagerBook />,
        },
        {
          path: "order",
          element: <ContactPage />,
        },
      ],
    },
  ]);
  const permissionPath = ["/login", "register", "/"];

  if (
    isLoading === true &&
    !permissionPath.includes(window.location.pathname)
  ) {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    return <RouterProvider router={router} />;
  //   return (
  //     <ConfigProvider
  //         theme={{
  //             token: {
  //                 fontFamily: "Times New Roman",
  //             },
  //         }}
  //     >
  //         <RouterProvider router={router} />
  //     </ConfigProvider>
  // )
  }
}
