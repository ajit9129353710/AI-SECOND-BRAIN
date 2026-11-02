import {
BrowserRouter,
Routes,
Route,
Navigate,
useLocation
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function AppRoutes() {
const location = useLocation();

const token = localStorage.getItem("token");

return (
<Routes>
<Route path="/" element={<Home />} />

  <Route
    path="/login"
    element={
      token ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <Login />
      )
    }
  />

  <Route
    path="/signup"
    element={
      token ? (
        <Navigate to="/dashboard" replace />
      ) : (
        <Signup />
      )
    }
  />

  <Route
    path="/dashboard"
    element={
      token ? (
        <Dashboard />
      ) : (
        <Navigate
          to="/login"
          replace
          state={{ from: location }}
        />
      )
    }
  />

  <Route
    path="*"
    element={<Navigate to="/" replace />}
  />
</Routes>

);
}

function App() {
return (
<BrowserRouter>
<AppRoutes />
</BrowserRouter>
);
}

export default App;