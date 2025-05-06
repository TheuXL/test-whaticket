import Ticket from "../../models/Ticket";
import AppError from "../../errors/AppError";

const DeleteTicketService = async (id: string): Promise<Ticket> => {
  console.log(`Tentando excluir ticket com ID: ${id}`);
  
  const ticket = await Ticket.findOne({
    where: { id }
  });

  if (!ticket) {
    console.error(`Ticket com ID ${id} não encontrado para exclusão`);
    throw new AppError(`Ticket com ID ${id} não encontrado`, 404);
  }

  await ticket.destroy();
  console.log(`Ticket com ID ${id} excluído com sucesso`);

  return ticket;
};

export default DeleteTicketService;
