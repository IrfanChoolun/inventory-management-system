import { useEffect, useState } from "react";
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

  const [globalUser, setGlobalUser] = useState({});

  console.log(globalUser);

  return (
    <Provider store={store}>
      <Router>
        <div className="App full">
          <Routes>
            <Route
              path="/"
              element={
                <LoginForm
                  globalUser={globalUser}
                  setGlobalUser={setGlobalUser}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  expandedItems={expandedItems}
                  setExpandedItems={setExpandedItems}
                  globalUser={globalUser}
                  setGlobalUser={setGlobalUser}
                />
              }
            />
            <Route
              path="*"
              element={
                <NotFound
                // expandedItems={expandedItems}
                // setExpandedItems={setExpandedItems}
                // globalUser={globalUser}
                // setGlobalUser={setGlobalUser}
                />
              }
            />
            {/* Views */}
            <Route
              path="/manageusers"
              element={
                <ManageUsers
                  expandedItems={expandedItems}
                  setExpandedItems={setExpandedItems}
                  globalUser={globalUser}
                  setGlobalUser={setGlobalUser}
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
