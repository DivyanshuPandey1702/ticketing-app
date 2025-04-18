import { Ticket } from "../tickets";

it("implementes optimistic concurrency control", async () => {
  //Create an instance of a ticket

  const ticket = Ticket.build({
    title: "concert",
    price: 4,
    userId: "123",
  });

  //save the ticket tot the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);
  // make two separate changes tot the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });
  //save the first fetched ticket
  await firstInstance!.save();

  //save the second fetched ticket
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error("Should not reach this point");
});
