import Sidebar from "../components/admin/sidebar/Sidebar";
import Students from "../components/admin/students/Students";
import Modules from "../components/admin/modules/Modules";
import Sectors from "../components/admin/sectors/Sectors";
import Sessions from "../components/admin/sessions/sessions";
import Users from "../components/admin/users/Users";
import UserSessions from "../components/user/sessions/UserSessions";
import { useAuth } from "./Auth";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Role } from "./roles";
import { NotFound } from "../components/common/not-found/NotFound";
import Login from "../components/login/Login";
import Dashboard from "../components/admin/dashboard/Dashboard";
import Redirect from "../components/login/Redirect";

export default function Router() {
  const { authenticatedUser } = useAuth();
  
  const adminRoutes = createBrowserRouter([
    { path: "/dashboard", element: <><Sidebar /> <Dashboard /></> },
    { path: "/students", element: <><Sidebar /> <Students /></> },
    { path: "/users", element: <><Sidebar /><Users /></> },
    { path: "/modules", element: <><Sidebar /><Modules /></> },
    { path: "/sectors", element: <><Sidebar /><Sectors /></> },
    { path: "/sessions", element: <><Sidebar /> <Sessions /></> },

    { path: "/", element: <Redirect to='/dashboard' /> },
    { path: "/*", element: <NotFound /> },
  ])

  const userRoutes = createBrowserRouter([
    { path: "/sessions", element: <><UserSessions /></> },

    { path: "/", element: <Redirect to='/sessions' /> },
    { path: "/*", element: <NotFound /> }
  ])

  const loginRoutes = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/*", element: <Redirect to='/' /> }
  ])

  return (
    <>
        {authenticatedUser?.role === Role.ADMIN && <RouterProvider router={adminRoutes} /> }
        {authenticatedUser?.role === Role.USER && <RouterProvider router={userRoutes} /> }
        {!authenticatedUser?.role && <RouterProvider router={loginRoutes} /> }
    </>
  )
}