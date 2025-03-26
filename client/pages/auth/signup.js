import { useState } from "react";
import Router from "next/router";
import userRequest from "../../hooks/user-request";
import useUser from "../../contexts/UserContext";

export default () => {
  const { assignUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = userRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });
  const onSubmit = async (event) => {
    event.preventDefault();

    const { email, id } = await doRequest();
    assignUser({ email, id });
  };
  return (
    <form>
      <h1>Sign Up</h1>
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
        Sign up
      </button>
    </form>
  );
};
