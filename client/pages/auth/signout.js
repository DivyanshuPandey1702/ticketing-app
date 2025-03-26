import { useEffect } from "react";
import Router from "next/router";
import userRequest from "../../hooks/user-request";
import useUser from "../../contexts/UserContext";

export default () => {
  const { deleteUser } = useUser();
  const { doRequest } = userRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => {
      deleteUser();

      Router.push("/");
    },
  });
  useEffect(() => {
    doRequest();
  }, []);
  return <div>signing you out</div>;
};
