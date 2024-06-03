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
import SocialMedia from "./pages/Home/SocialMedia";
import Blogs from "./pages/Home/Blogs";
import AddBlog from "./pages/Home/Blogs/AddBlog";
import Carrers from "./pages/Carrers";
import ContactUs from "./pages/ContactUs";
import Design from "./pages/Design";
import Pixel from "./pages/Pixel";
import HomePage from "./pages/HomePage";

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
    { url: "home/blogs", component: <Blogs /> },
    { url: "home/add-blog", component: <AddBlog /> },
    { url: "home/add-blog/:id", component: <AddBlog /> },
    { url: "home/carrers", component: <Carrers /> },
    { url: "home/contact-us", component: <ContactUs /> },

    // Design
    { url: "design", component: <Design /> },

    //Profile
    { url: "profile", component: <Profile /> },

    // Pixel
    { url: "seo-pixel", component: <Pixel /> },

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
