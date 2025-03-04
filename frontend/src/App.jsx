import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Profile from "./components/Profile";
import MainLayout from "./components/MainLayout";
import Contact from "./components/Contact";
import About from "./components/About";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import HomePage from "./components/Home";
import UploadImagePage from "./components/UploadImagePage";
import GroupImages from "./components/Group";
import GroupPage from "./components/SharedUserPage";
import DashboardPage from "./components/Dashboard";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoutes>
            <HomePage />
            <DashboardPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id",
        element: (
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id/edit",
        element: (
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/profile/:id/change-password",
        element: (
          <ProtectedRoutes>
            <ChangePassword />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/contact",
        element: (
          <ProtectedRoutes>
            <Contact />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/about",
        element: (
          <ProtectedRoutes>
            <About />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/upload-image",
        element: (
          <ProtectedRoutes>
            <UploadImagePage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/group/:id",
        element: (
          <ProtectedRoutes>
            <GroupImages />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoutes>
            <DashboardPage />
          </ProtectedRoutes>
        ),
      },
      {
        path: "/group/:groupName/:groupId",
        element: (
          <ProtectedRoutes>
            <GroupPage />
          </ProtectedRoutes>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;