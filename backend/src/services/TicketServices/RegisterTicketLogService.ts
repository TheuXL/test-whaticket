import TicketLog from "../../models/TicketLog";
import Ticket from "../../models/Ticket";
import User from "../../models/User";
import { getIO } from "../../libs/socket";

interface LogTicketData {
  ticketId: number;
  userId?: number | null;
  type: string;
  oldStatus?: string;
  newStatus?: string;
  oldUserId?: number;
  newUserId?: number;
  description?: string;
}

const RegisterTicketLogService = async ({
  ticketId,
  userId,
  type,
  oldStatus,
  newStatus,
  oldUserId,
  newUserId,
  description
}: LogTicketData): Promise<TicketLog> => {
  console.log(`Registrando log: Ticket #${ticketId}, Tipo ${type}, Descrição: ${description}`);
  
  const now = new Date();
  
  // Criando o registro de log
  const ticketLog = await TicketLog.create({
    ticketId,
    userId: userId || null,
    type,
    oldStatus,
    newStatus,
    oldUserId,
    newUserId,
    description,
    timestamp: now,
    createdAt: now,
    updatedAt: now
  });

  console.log(`Log registrado com sucesso: ID ${ticketLog.id}`);

  // Notificando via websocket
  const io = getIO();
  
  // Emit para os canais específicos e gerais
  io.to(`ticket:${ticketId}`).emit("ticket:log", {
    action: "create",
    ticketLog
  });
  
  // Também emitir para o canal geral do ticket
  io.to(ticketId.toString()).emit("ticket:log", {
    action: "create",
    ticketLog
  });

  return ticketLog;
};

export default RegisterTicketLogService; 