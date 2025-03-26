import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/user-request";
import Router from "next/router";
import buildClient from "../../api/build-client";
const OrderShow = ({ order, currentUser }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order?.id,
    },
    onSuccess: (payment) => Router.push("/orders"),
  });
  const [timeLeft, setTimeLeft] = useState();
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timeLeft);
    };
  }, []);
  if (timeLeft < 0) {
    return <div> Order Expires</div>;
  }

  return (
    <div>
      Time left to pay: {timeLeft} second
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51PDCaTSDRVgmzBeNcizNHyCrzDkDhkeY22qytFMci1l5CK4f9TeBymNGLm7dZdoGdNHG4TrttKtISm2CVaRgdKfP00yB0ulb8P"
        amount={order?.ticket?.price * 100}
        email={currentUser?.email ? currentUser.email : null}
      ></StripeCheckout>
      {errors}
    </div>
  );
};

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const {
    data: { currentUser },
  } = await client.get("/api/users/currentuser");
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { props: { order: data, currentUser: currentUser } };
}

export default OrderShow;
