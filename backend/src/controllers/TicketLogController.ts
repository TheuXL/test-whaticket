import { Request, Response } from "express";
import ListTicketLogsService from "../services/TicketServices/ListTicketLogsService";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

  console.log(`Recebendo requisição para logs do ticket: ${ticketId}, limit: ${limit}`);

  try {
    const ticketLogs = await ListTicketLogsService({ ticketId, limit });
    console.log(`Retornando ${ticketLogs.length} registros de log para o ticket ${ticketId}`);
    return res.status(200).json(ticketLogs);
  } catch (err: any) {
    console.error(`Erro ao buscar logs do ticket ${ticketId}:`, err);
    return res.status(400).json({ error: err.message });
  }
}; 