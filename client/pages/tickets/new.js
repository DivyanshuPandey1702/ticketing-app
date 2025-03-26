import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/user-request";
import buildClient from "../../api/build-client";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push("/"),
  });
  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };
  const onsubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
          />
        </div>
        {errors}
        <button className="btn btn-primary" onClick={onsubmit}>
          submit
        </button>
      </form>
    </div>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const {
    data: { currentUser },
  } = await client.get("/api/users/currentuser");

  return {
    props: { currentUser: currentUser },
  };
}

export default NewTicket;
