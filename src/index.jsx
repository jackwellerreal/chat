import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { App } from "./app.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
]);

createRoot(document.getElementById("root")).render(
        <RouterProvider router={router} />
);
