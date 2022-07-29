import useRoutes from "./routes";
import { useAuth } from "./hooks/auth.hook";

import { BrowserRouter } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Loader from "./components/Loader";

import "./App.css";
import "materialize-css";

function App() {
  const { token, login, logout, userId, ready } = useAuth();
  const isAuthentificated = !!token;
  const routes = useRoutes(isAuthentificated);

  if (!ready) {
    return <Loader />;
  } 

  return (
    <AuthContext.Provider
      value={{ token, userId, login, logout, isAuthentificated }}
    >
      <BrowserRouter>
        {isAuthentificated && <Navbar />}
        <div className="container">{routes}</div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
