import AppError from "../../errors/AppError";
import CheckContactOpenTickets from "../../helpers/CheckContactOpenTickets";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import Ticket from "../../models/Ticket";
import User from "../../models/User";
import ShowContactService from "../ContactServices/ShowContactService";
import RegisterTicketLogService from "./RegisterTicketLogService";
import { getIO } from "../../libs/socket";

interface Request {
  contactId: number;
  status: string;
  userId: number;
  queueId ?: number;
}

const CreateTicketService = async ({
  contactId,
  status,
  userId,
  queueId
}: Request): Promise<Ticket> => {
  const defaultWhatsapp = await GetDefaultWhatsApp(userId);

  await CheckContactOpenTickets(contactId, defaultWhatsapp.id);

  const { isGroup } = await ShowContactService(contactId);

  if(queueId === undefined) {
    const user = await User.findByPk(userId, { include: ["queues"]});
    queueId = user?.queues.length === 1 ? user.queues[0].id : undefined;
  }

  const { id }: Ticket = await defaultWhatsapp.$create("ticket", {
    contactId,
    status,
    isGroup,
    userId,
    queueId
  });

  const ticket = await Ticket.findByPk(id, { include: ["contact"] });

  if (!ticket) {
    throw new AppError("ERR_CREATING_TICKET");
  }

  const io = getIO();
  io.to(ticket.status).emit("ticket", {
    action: "create",
    ticket: ticket
  });

  // Registrando a criação do ticket no histórico
  await RegisterTicketLogService({
    ticketId: ticket.id,
    userId: ticket.userId || null,
    type: "create",
    newStatus: ticket.status,
    description: `Ticket criado`
  });

  return ticket;
};

export default CreateTicketService;
