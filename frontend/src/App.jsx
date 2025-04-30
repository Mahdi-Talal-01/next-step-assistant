import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import Sidebar from "./components/Sidebar";

function App() {
  return <RouterProvider router={router} />;
}

export default App;
