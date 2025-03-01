import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Profile from "./components/Profile";
import MainLayout from "./components/MainLayout";
import SummaryPage from "./components/Summary";
import HistoryPage from "./components/History";
import Contact from "./components/Contact";
import About from "./components/About";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import QuizPage from "./components/Quiz";

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element:
      <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes>,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/profile/:id',
        element:
          <ProtectedRoutes>
            <Profile />
          </ProtectedRoutes>
      },
      {
        path: '/profile/:id/edit',
        element:
          <ProtectedRoutes>
            <EditProfile />
          </ProtectedRoutes>
      },
      {
        path: '/profile/:id/change-password',
        element:
          <ProtectedRoutes>
            <ChangePassword />
          </ProtectedRoutes>
      },
      {
        path: '/summary/:id',
        element:
          <ProtectedRoutes>
            <SummaryPage />
          </ProtectedRoutes>
      },
      {
        path: '/quiz/:id',
        element:
          <ProtectedRoutes>
            <QuizPage />
          </ProtectedRoutes>
      },
      {
        path: '/history',
        element:
          <ProtectedRoutes>
            <HistoryPage />
          </ProtectedRoutes>
      },
      {
        path: '/contact',
        element:
          <ProtectedRoutes>
            <Contact />
          </ProtectedRoutes>
      },
      {
        path: '/about',
        element:
          <ProtectedRoutes>
            <About />
          </ProtectedRoutes>
      },
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
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