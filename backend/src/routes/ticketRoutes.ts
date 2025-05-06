import express from "express";
import isAuth from "../middleware/isAuth";

import * as TicketController from "../controllers/TicketController";
import * as TicketLogController from "../controllers/TicketLogController";

const ticketRoutes = express.Router();

ticketRoutes.get("/tickets", isAuth, TicketController.index);

ticketRoutes.get("/tickets/:ticketId", isAuth, TicketController.show);

ticketRoutes.post("/tickets", isAuth, TicketController.store);

ticketRoutes.put("/tickets/:ticketId", isAuth, TicketController.update);

ticketRoutes.delete("/tickets/:ticketId", isAuth, TicketController.remove);

// Novas rotas para pausar e despausar tickets
ticketRoutes.post("/tickets/:ticketId/pause", isAuth, TicketController.pause);
ticketRoutes.post("/tickets/:ticketId/resume", isAuth, TicketController.resume);
ticketRoutes.post("/tickets/:ticketId/reopen", isAuth, TicketController.reopen);

// Rota para histórico de logs do ticket
ticketRoutes.get("/tickets/:ticketId/logs", isAuth, TicketLogController.index);

export default ticketRoutes;
