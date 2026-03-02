import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SOSHistory from "./pages/SOSHistory";
import MapView from "./pages/MapView";

function App() {

  const token = localStorage.getItem("token");

  return (

    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={
          token ? <Home /> : <Navigate to="/login" />
        }
      />

      {/* Login */}
      <Route
        path="/login"
        element={
          token ? <Navigate to="/" /> : <Login />
        }
      />

      {/* Register */}
      <Route
        path="/register"
        element={
          token ? <Navigate to="/" /> : <Register />
        }
      />

      {/* SOS History */}
      <Route
        path="/history"
        element={
          token ? <SOSHistory /> : <Navigate to="/login" />
        }
      />

      {/* Live Map */}
      <Route
        path="/map"
        element={
          token ? <MapView /> : <Navigate to="/login" />
        }
      />

    </Routes>

  );

}

export default App;
