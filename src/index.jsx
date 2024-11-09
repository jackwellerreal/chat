import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { App } from "./pages/app/index.jsx";
import { Settings } from "./pages/settings/index.jsx";
import { SignIn } from "./pages/signin/index.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/settings",
        element: <Settings />,
    },
    {
        path: "/signin",
        element: <SignIn />,
    },
]);

createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
