import { useState } from "react";
import Router from "next/router";
import userRequest from "../../hooks/user-request";
import useUser from "../../contexts/UserContext";

export default () => {
  const { assignUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = userRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });
  const onSubmit = async (event) => {
    console.log(event);
    event.preventDefault();
    const response = await doRequest({}, {});
    const { email, id } = response;
    if (email && id) {
      assignUser({ email, id });
    }
  };
  const signInGoolge = async (event) => {
    event.preventDefault();
    window.location.href = "/api/users/google-signin";
  };
  return (
    <form>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          className="form-control"
        />
      </div>
      {errors}
      <button className="btn btn-primary" onClick={onSubmit}>
        Sign In
      </button>
      <br></br>
      <br></br>
      <a className="btn btn-secondary" onClick={(e) => signInGoolge(e)}>
        Google SignIn
      </a>
    </form>
  );
};
