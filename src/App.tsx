import React, { useEffect, createContext, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import store from "./store";
import { Provider } from "react-redux";
// Views
import ManageUsers from "./pages/ManageUsers";

function App() {
  useEffect(() => {}, []); // Empty for now

  const [expandedItems, setExpandedItems] = useState({
    empty: false,
    inventory: false,
    reports: false,
    suppliers: false,
    orders: false,
    users: false,
  });

  return (
    <Provider store={store}>
      <Router>
        <div className="App full">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  expandedItems={expandedItems}
                  setExpandedItems={setExpandedItems}
                />
              }
            />
            <Route path="*" element={<NotFound />} />
            {/* Views */}
            <Route
              path="/manageusers"
              element={
                <ManageUsers
                  expandedItems={expandedItems}
                  setExpandedItems={setExpandedItems}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
