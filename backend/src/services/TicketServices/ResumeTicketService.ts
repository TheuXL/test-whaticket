import Ticket from "../../models/Ticket";
import ShowTicketService from "./ShowTicketService";
import { getIO } from "../../libs/socket";
import RegisterTicketLogService from "./RegisterTicketLogService";
import AppError from "../../errors/AppError";

interface ResumeTicketData {
  ticketId: string | number;
  userId: number;
}

const ResumeTicketService = async ({
  ticketId,
  userId
}: ResumeTicketData): Promise<Ticket> => {
  // Garantir que o ticketId seja um número
  const parsedTicketId = typeof ticketId === "string" ? parseInt(ticketId, 10) : ticketId;
  
  if (isNaN(Number(parsedTicketId))) {
    throw new AppError("ID de ticket inválido", 400);
  }

  try {
    // Adicionando log para debug
    console.log(`Tentando despausar ticket: ID=${parsedTicketId}, User=${userId}`);
    
    let ticket;
    try {
      ticket = await ShowTicketService(parsedTicketId);
    } catch (error) {
      console.error(`Erro ao buscar ticket ${parsedTicketId}:`, error);
      throw new AppError(`Ticket não encontrado com o ID: ${parsedTicketId}`, 404);
    }
    
    if (!ticket) {
      console.error(`Ticket não encontrado com o ID: ${parsedTicketId}`);
      throw new AppError(`Ticket não encontrado com o ID: ${parsedTicketId}`, 404);
    }

    console.log(`Ticket encontrado: ${ticket.id}, status atual: ${ticket.status}`);

    if (ticket.status !== "paused") {
      console.log(`Ticket ${ticket.id} não está pausado (status atual: ${ticket.status})`);
      throw new AppError(`O ticket não está pausado (status atual: ${ticket.status})`, 400);
    }

    const oldStatus = ticket.status;

    await ticket.update({
      status: "open",
      userId
    });

    await ticket.reload();
    console.log(`Ticket ${ticket.id} despausado com sucesso, novo status: ${ticket.status}`);

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
  } catch (err) {
    console.error("Erro ao despausar ticket:", err);
    throw err;
  }
};

export default ResumeTicketService; 