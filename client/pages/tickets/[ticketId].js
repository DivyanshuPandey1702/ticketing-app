import useRequest from "../../hooks/user-request";
import Router from "next/router";
import buildClient from "../../api/build-client";
const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket?.id,
    },
    onSuccess: (order) =>
      Router.push("/orders/[orderId]", `/orders/${order.id}`),
  });
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price:{ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
};

// TicketShow.getInitialProps = async (context) => {
//   console.log("here");
//   // const { ticketId } = context.query;
//   // const { data } = await client.get(`/api/tickets/${ticketId}`);
//   return { ticket: [] };
// };

export async function getServerSideProps(context) {
  const client = buildClient(context);
  const {
    data: { currentUser },
  } = await client.get("/api/users/currentuser");

  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return {
    props: { ticket: data, currentUser: currentUser },
  };
}

export default TicketShow;
