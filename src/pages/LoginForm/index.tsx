import { useState, useEffect, useRef } from "react";
import { UserService, User } from "../../utils/services/UserService";
import { useNavigate } from "react-router-dom";
import "./LoginForm.scss";

function LoginForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  function handleUsername(event: any) {
    setUsername(event.target.value);
  }

  function handlePassword(event: any) {
    setPassword(event.target.value);
  }

  function handleLogin(event: any) {
    event.preventDefault();
    console.log("Logging in...");
    UserService.userLogin(username, password).then((response) => {
      console.log("Login Success", response);
      navigate("/home");
    });
  }

  function togglePasswordShow(_: any) {
    const passwordInput = document.querySelector("input[name='password']");
    if (showPassword) {
      passwordInput?.setAttribute("type", "password");
      setShowPassword(false);
    } else {
      passwordInput?.setAttribute("type", "text");
      setShowPassword(true);
    }
  }

  return (
    <div className="loginPage">
      <div className="formContents">
        <div className="left_section">
          <h1>All In One Solution</h1>
          <span className="title">Inventory</span>
          <span className="title">Management</span>
          <span className="title">System</span>
          <img
            className="bottom_vector"
            src="src/assets/images/vector_10.png"
            alt=""
          />
          <img
            className="drop_shadow"
            src="src/assets/images/drop_shadow.png"
            alt=""
          />
        </div>
        <div className="right_section">
          <img
            className="dividing_vector"
            src="src/assets/images/vector_12.png"
          />
          <div className="form_container">
            <h2>
              Welcome <br /> Back
            </h2>
            <form id="loginForm">
              <label>
                <span>Username:</span>
                <input
                  onChange={handleUsername}
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                />
              </label>
              <label>
                <span>Password:</span>
                <input
                  onChange={handlePassword}
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                />
                <i
                  id="togglePassword"
                  className={"eye-icon" + (showPassword ? " show" : " hide")}
                  onClick={togglePasswordShow}
                ></i>
              </label>
              <button onClick={handleLogin} type="submit">
                Sign in
              </button>
            </form>
          </div>
          <img
            className="bottom_vector"
            src="src/assets/images/vector_10.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
