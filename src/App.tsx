import { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginForm from "./pages/LoginForm";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

function App() {
  useEffect(() => {
    // handleFetchUsers();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
