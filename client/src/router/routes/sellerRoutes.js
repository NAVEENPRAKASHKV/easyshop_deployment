import { lazy } from "react";
import BlogAddingPage from "../../views/seller/BlogAddPage";

const SellerDashboard = lazy(() =>
  import("./../../views/seller/SellerDashboard")
);
const AllProduct = lazy(() => import("./../../views/seller/AllProduct"));
const AddProduct = lazy(() => import("./../../views/seller/AddProduct"));
const SellerOrders = lazy(() => import("./../../views/seller/SellerOrders"));
const EditProduct = lazy(() => import("./../../views/seller/EditProduct"));
const SellerOrderDetails = lazy(() =>
  import("../../views/seller/SellerOrderDetails")
);
const Payments = lazy(() => import("./../../views/seller/Payments"));
const SellerToAdmin = lazy(() => import("./../../views/seller/SellerToAdmin"));
const SellerToCustomer = lazy(() =>
  import("./../../views/seller/SellerToCustomer")
);
const Profile = lazy(() => import("../../views/seller/Profile"));
const Offer = lazy(() => import("./../../views/seller/Offer"));
const Pending = lazy(() => import("./../../views/Pending"));
const Deactive = lazy(() => import("./../../views/Deactive"));

export const sellerRoutes = [
  {
    path: "/seller/dashboard",
    element: <SellerDashboard />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/all-product",
    element: <AllProduct />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/add-product",
    element: <AddProduct />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/edit-product/:productId",
    element: <EditProduct />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/orders",
    element: <SellerOrders />,
    role: "seller",
    visibility: ["active", "deactive"],
  },
  {
    path: "/seller/dashboard/order/details/:orderId",
    element: <SellerOrderDetails />,
    role: "seller",
    visibility: ["active", "deactive"],
  },
  {
    path: "/seller/dashboard/Blog",
    element: <BlogAddingPage />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/chat-support",
    element: <SellerToAdmin />,
    role: "seller",
    visibility: ["active", "deactive", "pending"],
  },
  {
    path: "/seller/dashboard/chat-customer/:customerId",
    element: <SellerToCustomer />,
    role: "seller",
    status: "active",
  },
  {
    path: "/seller/dashboard/profile",
    element: <Profile />,
    role: "seller",
    visibility: ["active", "deactive", "pending"],
  },
  {
    path: "/seller/account-pending",
    element: <Pending />,
    ability: "seller",
  },
  {
    path: "/seller/account-deactive",
    element: <Deactive />,
    ability: "seller",
  },
];
