import Sidebar from "../admin/sidebar/Sidebar";
import Students from "../admin/students/Students";
import Modules from "../admin/modules/Modules";
import Sectors from "../admin/sectors/Sectors";
import Sessions from "../admin/sessions/Sessions";
import Users from "../admin/users/Users";
import UserSessions from "../user/sessions/UserSessions";
import { useAuth } from "../../utilities/Auth";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Role } from "../../utilities/roles";
import { NotFound } from "./not-found/NotFound";
import Login from "../login/Login";
import Dashboard from "../admin/dashboard/Dashboard";
import Redirect from "../login/Redirect";

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
        {(authenticatedUser?.role === Role.ADMIN || authenticatedUser?.role === Role.SUPER_ADMIN) && <RouterProvider router={adminRoutes} /> }
        {authenticatedUser?.role === Role.USER && <RouterProvider router={userRoutes} /> }
        {!authenticatedUser?.role && <RouterProvider router={loginRoutes} /> }
    </>
  )
}