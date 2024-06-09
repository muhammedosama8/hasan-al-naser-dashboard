import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
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

const Markup = () => {
  const allroutes = [
    { url: "", component: <Admins /> },

    // Admins
    { url: "admins", component: <Admins /> },
    { url: "admins/add-admins", component: <AddAdmin /> },
    { url: "admins/edit-admin/:id/:name", component: <AddAdmin /> },

    // Rules
    { url: "rules", component: <Permission /> },
    { url: "rules/:id", component: <Permission /> },

    // Home
    { url: "home/social", component: <SocialMedia /> },
    { url: "home/page", component: <HomePage /> },
    { url: "home/contact-us", component: <ContactUs /> },

    // Products
    { url: "home/products", component: <Products /> },
    { url: "home/products/add-products", component: <AddProducts /> },
    { url: "home/products/add-products/:id", component: <AddProducts /> },

    // Master HN
    { url: "masterHN/products", component: <MasterHNProducts /> },
    { url: "masterHN/products/add-products", component: <MasterHNAddProducts /> },
    { url: "masterHN/products/add-products/:id", component: <MasterHNAddProducts /> },
  
    { url: "masterHN/categories", component: <Categories /> },

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
