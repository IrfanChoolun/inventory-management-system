import { useState } from "react";
import { UserService, User } from "../../utils/UserService";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "./../../utils/slices/userSlice";
import "./LoginForm.scss";

function LoginForm() {
  const users: User = useSelector((state: any) => state.user.value);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function handleLogin(event: any) {
    event.preventDefault();
    console.log("Logging in...");

    let username = (document.getElementById("username") as HTMLInputElement)
      .value;
    let password = (document.getElementById("password") as HTMLInputElement)
      .value;

    try {
      const response = await UserService.userLogin(username, password);
      // Handle success scenario
      if (response.success) {
        console.log("Login Success", response);
        dispatch(addUser(response.user));
        navigate("/home");
      } else {
        console.log(response.error);
      }
    } catch (err) {
      console.error("Login Error:", err);
    }
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
    <div className="loginPage full">
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
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter Username"
                />
              </label>
              <label>
                <span>Password:</span>
                <input
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
