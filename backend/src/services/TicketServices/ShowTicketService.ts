import Ticket from "../../models/Ticket";
import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import User from "../../models/User";
import Queue from "../../models/Queue";
import Whatsapp from "../../models/Whatsapp";

const ShowTicketService = async (id: string | number): Promise<Ticket> => {
  // Garantir que o id seja um número válido
  if (id === undefined || id === null) {
    throw new AppError("ID do ticket não fornecido", 400);
  }
  
  // Se for string, tentar converter para número
  const ticketId = typeof id === "string" ? parseInt(id, 10) : id;
  
  if (isNaN(Number(ticketId))) {
    throw new AppError(`ID de ticket inválido: ${id}`, 400);
  }

  try {
    console.log(`Buscando ticket pelo ID: ${ticketId}`);
    
    const ticket = await Ticket.findByPk(ticketId, {
      include: [
        {
          model: Contact,
          as: "contact",
          attributes: ["id", "name", "number", "profilePicUrl"],
          include: ["extraInfo"]
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name"]
        },
        {
          model: Queue,
          as: "queue",
          attributes: ["id", "name", "color"]
        },
        {
          model: Whatsapp,
          as: "whatsapp",
          attributes: ["name"]
        }
      ]
    });

    if (!ticket) {
      console.error(`Ticket com ID ${ticketId} não encontrado no banco de dados`);
      throw new AppError(`Ticket com ID ${ticketId} não encontrado`, 404);
    }

    return ticket;
  } catch (err: any) {
    console.error(`Erro ao buscar ticket ${ticketId}:`, err);
    
    // Verifica se é um erro já tratado (AppError)
    if (err instanceof AppError) {
      throw err;
    }
    
    // Se for outro tipo de erro
    throw new AppError(`Erro ao buscar ticket: ${err.message || 'Erro desconhecido'}`, 500);
  }
};

export default ShowTicketService;
