import OutLayet from "../outlet/OutLayet";
import CheckEmailUser from "../pages/CheckEmailUser";
import CheckPassword from "../pages/CheckPassword";
import ForgetPassword from "../pages/ForgetPassword";
import Home from "../pages/Home";
import MessagesPage from "../pages/MessagesPage";
import RegisterUser from "../pages/RegisterUser";

const { createBrowserRouter } = require("react-router-dom");
const { default: App } = require("../App");
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "/:userId",
            element: <MessagesPage />,
          },
        ],
      },

      {
        path: "register",
        element: (
          <OutLayet>
            <RegisterUser />
          </OutLayet>
        ),
      },
      {
        path: "checkemail",
        element: (
          <OutLayet>
            <CheckEmailUser />,
          </OutLayet>
        ),
      },
      {
        path: "checkpassword",
        element: (
          <OutLayet>
            <CheckPassword />,
          </OutLayet>
        ),
      },
      {
        path: "forgetpassword",
        element: (
          <OutLayet>
            <ForgetPassword />,
          </OutLayet>
        ),
      },
    ],
  },
]);
export default router;
