import React, { useEffect } from "react";
import { Routes, Route, Outlet, useLocation, useNavigate } from "react-router-dom";
/// Css
import "./index.css";
import "./chart.css";
import "./step.css";

/// Layout
import Nav from "./layouts/nav";
import Footer from "./layouts/Footer";

/// Pages
import Error404 from "./common/Error404";

//Scroll To Top
import ScrollToTop from "./layouts/ScrollToTop";

import Admins from "./pages/Admin";
import AddAdmin from "./pages/Admin/AddAdmin";
import Permission from "./pages/Rules";
import Profile from "./pages/Profile";
import SocialMedia from "./pages/Setting/SocialMedia";
import ContactUs from "./pages/ContactUs";
import HomePage from "./pages/HomePage";
import Products from "./pages/Products";
import AddProducts from "./pages/Products/AddProducts";
import MasterHNProducts from "./pages/MasterHN/Products";
import MasterHNAddProducts from "./pages/MasterHN/Products/AddProducts";
import Categories from "./pages/MasterHN/Categories";
import Static from "./pages/Setting/StaticPages/Static";
import DynamicVariant from "./pages/MasterHN/DynamicVariant";
import AddDynamicVariant from "./pages/MasterHN/DynamicVariant/AddVariant";
import Variant from "./pages/MasterHN/Variant";
import AddVariant from "./pages/MasterHN/Variant/AddVariant";
import Notification from "./pages/MasterHN/Notification";
import AddNotification from "./pages/MasterHN/Notification/AddNotification";
import Orders from "./pages/MasterHN/Orders";
import AddOrders from "./pages/MasterHN/Orders/AddOrders";
import OrderDetails from "./pages/MasterHN/Orders/Details";
import Invoice from "./pages/MasterHN/Orders/Invoice";
import PromCodes from "./pages/MasterHN/PromoCodes";
import AddPromoCodes from "./pages/MasterHN/PromoCodes/AddPromoCodes";
import Banners from "./pages/MasterHN/Banners";
import Delivery from "./pages/MasterHN/Delivery";
import Payment from "./pages/MasterHN/Payment";
import MasterSocialMedia from "./pages/MasterHN/SocialMedia";
import Currency from "./pages/MasterHN/Currency";
import MasterStaticPages from "./pages/MasterHN/MasterStaticPages";
import MasterStatic from "./pages/MasterHN/MasterStaticPages/Static";
import StyleUp from "./pages/MasterHN/StyleUp";
import Home from "./pages/MasterHN/Dashboard";
import Users from "./pages/MasterHN/Users";
import UserProfile from "./pages/MasterHN/Users/Profile";

const Markup = () => {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{
    if(location?.pathname === "/login"){
      navigate('/')
    }
  },[location])

  const allroutes = [
    /// Dashboard
    { url: "", component: <Admins /> },
    { url: "masterHN/dashboard", component: <Home /> },

    // Admins
    { url: "admins", component: <Admins /> },
    { url: "admins/add-admins", component: <AddAdmin /> },
    { url: "admins/edit-admin/:id/:name", component: <AddAdmin /> },

    // Users
    { url: "masterHN/users", component: <Users /> },
    { url: "masterHN/users/profile", component: <UserProfile /> },

    // Rules
    { url: "rules", component: <Permission /> },
    { url: "rules/:id", component: <Permission /> },

    // Home
    { url: "home/social", component: <SocialMedia /> },
    { url: "home/page", component: <HomePage /> },
    { url: "home/contact-us", component: <ContactUs /> },

    // Home About Us
    { url: "home/about-us", component: <Static /> },

    // Products
    { url: "home/products", component: <Products /> },
    { url: "home/products/add-products", component: <AddProducts /> },
    { url: "home/products/add-products/:id", component: <AddProducts /> },

    // Master HN
    { url: "masterHN/products", component: <MasterHNProducts /> },
    { url: "masterHN/products/add-products", component: <MasterHNAddProducts /> },
    { url: "masterHN/products/add-products/:id", component: <MasterHNAddProducts /> },
  
    { url: "masterHN/categories", component: <Categories /> },

    //  => DynamicVariant
    { url: "dynamic-variant", component: <DynamicVariant /> },
    {
      url: "dynamic-variant/add-dynamic-variant",
      component: <AddDynamicVariant />,
    },
    {
      url: "dynamic-variant/edit-dynamic-variant/:id",
      component: <AddDynamicVariant />,
    },

    //  => Variant
    { url: "variant", component: <Variant /> },
    { url: "variant/add-variant", component: <AddVariant /> },
    { url: "variant/add-variant/:id", component: <AddVariant /> },

    //  => Notification
    { url: "notification", component: <Notification /> },
    { url: "notification/add-notification", component: <AddNotification /> },

    //  => Orders
    { url: "orders", component: <Orders /> },
    { url: "orders/add-orders", component: <AddOrders /> },
    { url: "orders/details", component: <OrderDetails /> },
    { url: "orders/invoice", component: <Invoice /> },

    //  => Promo Codes
    { url: "promo-codes", component: <PromCodes /> },
    { url: "promo-codes/add-promo-codes", component: <AddPromoCodes /> },
    { url: "promo-codes/edit-promo-codes", component: <AddPromoCodes /> },

    //  => Banners
    { url: "banners", component: <Banners /> },

    //  => Style Up
    { url: "masterHN/style-up", component: <StyleUp /> },

    //  => Setting
    { url: "social", component: <MasterSocialMedia /> },
    { url: "currency", component: <Currency /> },
    { url: "pages", component: <MasterStaticPages /> },
    { url: "pages/about-us", component: <MasterStatic /> },
    { url: "delivery", component: <Delivery /> },
    { url: "payment", component: <Payment /> },

    //Profile
    { url: "profile", component: <Profile /> },

    // Error
    { url: "*", component: <Error404 /> },
  ];

  return (
    <>
      <Routes>
        <Route path="page-error-404" element={<Error404 />} />
        <Route element={<MainLayout />}>
          {allroutes.map((data, i) => (
            <Route
              key={i}
              exact
              path={`${data.url}`}
              element={data.component}
            />
          ))}
        </Route>
      </Routes>
      <ScrollToTop />
    </>
  );
};

function MainLayout() {
  return (
    <div id="main-wrapper" className={`show `}>
      <Nav />
      <div
        className="content-body"
        style={{ minHeight: window.screen.height - 45 }}
      >
        <div className="container-fluid">
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Markup;
