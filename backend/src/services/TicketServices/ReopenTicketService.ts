import Ticket from "../../models/Ticket";
import ShowTicketService from "./ShowTicketService";
import { getIO } from "../../libs/socket";
import RegisterTicketLogService from "./RegisterTicketLogService";

interface ReopenTicketData {
  ticketId: string | number;
  userId: number;
}

const ReopenTicketService = async ({
  ticketId,
  userId
}: ReopenTicketData): Promise<Ticket> => {
  const ticket = await ShowTicketService(ticketId);

  if (ticket.status !== "closed") {
    throw new Error("O ticket não está fechado");
  }

  const oldStatus = ticket.status;

  await ticket.update({
    status: "open",
    userId
  });

  await ticket.reload();

  // Registrar o log de reabertura
  await RegisterTicketLogService({
    ticketId: ticket.id,
    userId,
    type: "reopen",
    oldStatus,
    newStatus: "open",
    description: `Ticket reaberto`
  });
  
  const io = getIO();
  
  io.to("closed").emit("ticket", {
    action: "delete",
    ticketId: ticket.id
  });

  io.to("open").emit("ticket", {
    action: "update",
    ticket
  });

  return ticket;
};

export default ReopenTicketService; 