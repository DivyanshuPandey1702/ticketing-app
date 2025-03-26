import Link from "next/link";
import buildClient from "../api/build-client";
const landingPage = ({ tickets }) => {
  const ticektList = tickets?.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticektList}</tbody>
      </table>
    </div>
  );
};

export async function getServerSideProps(context) {
  console.log("her");
  const client = buildClient(context);
  const {
    data: { currentUser },
  } = await client.get("/api/users/currentuser");
  const { data } = await client.get("/api/tickets");
  console.log(currentUser);
  return {
    props: { tickets: data || [], currentUser: currentUser },
  };
}

export default landingPage;
