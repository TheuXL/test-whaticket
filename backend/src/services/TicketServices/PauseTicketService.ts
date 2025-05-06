import Ticket from "../../models/Ticket";
import ShowTicketService from "./ShowTicketService";
import { getIO } from "../../libs/socket";
import CreateTicketService from "./CreateTicketService";
import RegisterTicketLogService from "./RegisterTicketLogService";

interface PauseTicketData {
  ticketId: string | number;
  userId: number;
}

const PauseTicketService = async ({
  ticketId,
  userId
}: PauseTicketData): Promise<Ticket> => {
  const ticket = await ShowTicketService(ticketId);

  if (ticket.status === "closed") {
    throw new Error("Ticket já está fechado");
  }

  const oldStatus = ticket.status;

  await ticket.update({
    status: "paused",
    userId
  });

  await ticket.reload();

  // Registrar o log de pausa
  await RegisterTicketLogService({
    ticketId: ticket.id,
    userId,
    type: "pause",
    oldStatus,
    newStatus: "paused",
    description: `Ticket pausado por atendente`
  });

  const io = getIO();
  if (ticket.status === "paused") {
    io.to("open").emit("ticket", {
      action: "delete",
      ticketId: ticket.id
    });

    io.to("pending").emit("ticket", {
      action: "delete",
      ticketId: ticket.id
    });

    io.to("paused").emit("ticket", {
      action: "update",
      ticket
    });
  }

  return ticket;
};

export default PauseTicketService; 