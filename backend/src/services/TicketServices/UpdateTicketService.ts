import CheckContactOpenTickets from "../../helpers/CheckContactOpenTickets";
import SetTicketMessagesAsRead from "../../helpers/SetTicketMessagesAsRead";
import { getIO } from "../../libs/socket";
import Ticket from "../../models/Ticket";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";
import ShowWhatsAppService from "../WhatsappService/ShowWhatsAppService";
import ShowTicketService from "./ShowTicketService";
import RegisterTicketLogService from "./RegisterTicketLogService";

interface TicketData {
  status?: string;
  userId?: number;
  queueId?: number;
  whatsappId?: number;
}

interface Request {
  ticketData: TicketData;
  ticketId: string | number;
}

interface Response {
  ticket: Ticket;
  oldStatus: string;
  oldUserId: number | undefined;
}

const UpdateTicketService = async ({
  ticketData,
  ticketId
}: Request): Promise<Response> => {
  const { status, userId, queueId, whatsappId } = ticketData;

  const ticket = await ShowTicketService(ticketId);
  await SetTicketMessagesAsRead(ticket);

  if(whatsappId && ticket.whatsappId !== whatsappId) {
    await CheckContactOpenTickets(ticket.contactId, whatsappId);
  }

  const oldStatus = ticket.status;
  const oldUserId = ticket.user?.id;

  if (oldStatus === "closed") {
    await CheckContactOpenTickets(ticket.contact.id, ticket.whatsappId);
  }

  await ticket.update({
    status,
    queueId,
    userId
  });

  if(whatsappId) {
    await ticket.update({
      whatsappId
    });
  }

  await ticket.reload();

  // Registrar o log das alterações
  if (status && status !== oldStatus) {
    // Log de mudança de status
    let description = `Status alterado de ${oldStatus} para ${status}`;
    let type = "statusChange";
    
    // Tipo e descrição específicos para fechamento de ticket
    if (status === "closed") {
      description = `Ticket finalizado`;
      type = "close";
    }
    
    await RegisterTicketLogService({
      ticketId: ticket.id,
      userId: userId || ticket.userId,
      type,
      oldStatus,
      newStatus: status,
      description
    });
  }

  if (userId && oldUserId !== userId) {
    // Log de mudança de usuário
    await RegisterTicketLogService({
      ticketId: ticket.id,
      userId: userId,
      type: "userChange",
      oldUserId,
      newUserId: userId,
      description: `Ticket transferido para outro atendente`
    });
  }

  const io = getIO();

  if (ticket.status !== oldStatus || ticket.user?.id !== oldUserId) {
    io.to(oldStatus).emit("ticket", {
      action: "delete",
      ticketId: ticket.id
    });
  }

  io.to(ticket.status)
    .to("notification")
    .to(ticketId.toString())
    .emit("ticket", {
      action: "update",
      ticket
    });

  return { ticket, oldStatus, oldUserId };
};

export default UpdateTicketService;
