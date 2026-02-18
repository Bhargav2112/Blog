// Home removed as per user request
import BlogListing from "./pages/BlogListing";
import BlogDetail from "./pages/BlogDetail";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPosts from "./pages/AdminPosts";
import AdminCreatePost from "./pages/AdminCreatePost";
import AdminEditPost from "./pages/AdminEditPost";
import AdminCategories from "./pages/AdminCategories";
import AdminUsers from "./pages/AdminUsers";
import AdminMessages from "./pages/AdminMessages";
import __Layout from "./Layout.jsx";

export const PAGES = {
  bloglisting: BlogListing,
  blogdetail: BlogDetail,
  register: Register,
  login: Login,
  "forgot-password": ForgotPassword,
  about: About,
  contact: Contact,
  profile: Profile,
  savedposts: Favorites,
  privacy: Privacy,
  terms: Terms,
  admindashboard: AdminDashboard,
  adminposts: AdminPosts,
  admincreatepost: AdminCreatePost,
  "admin-create-post": AdminCreatePost, // Legacy support
  admineditpost: AdminEditPost,
  "admin-edit-post": AdminEditPost, // Legacy support
  admincategories: AdminCategories,
  adminusers: AdminUsers,
  adminmessages: AdminMessages,
};

export const pagesConfig = {
  mainPage: "bloglisting",
  Pages: PAGES,
  Layout: __Layout,
};
