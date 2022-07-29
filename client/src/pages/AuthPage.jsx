import React from "react";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

const AuthPage = () => {
  const auth = useContext(AuthContext);
  const message = useMessage();
  const { loading, error, request, clearError } = useHttp();
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    message(error);
    clearError();
  }, [clearError, error, message]);

  useEffect(() => {
    window.M.updateTextFields();
  }, []);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      message(data.message);
    } catch (e) {}
  };

  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      auth.login(data.token, data.userId);
    } catch (e) {}
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>ShortenLink</h1>
        <div className="card blue darken-1">
          <div className="card-content white-text">
            <span className="card-title">Authorization</span>
            <div>
              <div className="input-field">
                <input
                  value={form.email}
                  placeholder="Enter email"
                  id="email"
                  type="text"
                  className="yellow-input"
                  onChange={changeHandler}
                  name="email"
                  autoComplete="off"
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="input-field">
                <input
                  value={form.password}
                  placeholder="Enter password"
                  id="password"
                  type="password"
                  className="yellow-input"
                  onChange={changeHandler}
                  name="password"
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              onClick={loginHandler}
              className="btn yellow darken-4"
              style={{ marginRight: 10 }}
              disabled={loading}
            >
              Log in
            </button>
            <button
              onClick={registerHandler}
              className="btn grey lighten-1 black-text"
              disabled={loading}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
