import TicketLog from "../../models/TicketLog";
import User from "../../models/User";

interface Request {
  ticketId: string | number;
  limit?: number;
}

const ListTicketLogsService = async ({
  ticketId,
  limit = 100
}: Request): Promise<TicketLog[]> => {
  console.log(`Buscando logs para o ticket ${ticketId} com limite ${limit}`);
  
  // Garantir que ticketId seja um número
  const numericTicketId = typeof ticketId === 'string' ? parseInt(ticketId, 10) : ticketId;
  
  try {
    const ticketLogs = await TicketLog.findAll({
      where: { ticketId: numericTicketId },
      limit,
      order: [["timestamp", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"]
        }
      ]
    });

    console.log(`Encontrados ${ticketLogs.length} logs para o ticket ${ticketId}`);
    
    return ticketLogs;
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    throw error;
  }
};

export default ListTicketLogsService; 