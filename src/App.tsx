import { useEffect, createContext } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import store from "./store";
import { Provider } from "react-redux";

function App() {
  useEffect(() => {}, []);
  return (
    <Provider store={store}>
      <Router>
        <div className="App full">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
