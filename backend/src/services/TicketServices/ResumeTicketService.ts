import Ticket from "../../models/Ticket";
import ShowTicketService from "./ShowTicketService";
import { getIO } from "../../libs/socket";
import RegisterTicketLogService from "./RegisterTicketLogService";

interface ResumeTicketData {
  ticketId: string | number;
  userId: number;
}

const ResumeTicketService = async ({
  ticketId,
  userId
}: ResumeTicketData): Promise<Ticket> => {
  const ticket = await ShowTicketService(ticketId);

  if (ticket.status !== "paused") {
    throw new Error("O ticket não está pausado");
  }

  const oldStatus = ticket.status;

  await ticket.update({
    status: "open",
    userId
  });

  await ticket.reload();

  // Registrar o log de despause
  await RegisterTicketLogService({
    ticketId: ticket.id,
    userId,
    type: "resume",
    oldStatus,
    newStatus: "open",
    description: `Ticket despausado por atendente`
  });
  
  const io = getIO();
  
  io.to("paused").emit("ticket", {
    action: "delete",
    ticketId: ticket.id
  });

  io.to("open").emit("ticket", {
    action: "update",
    ticket
  });

  return ticket;
};

export default ResumeTicketService; 