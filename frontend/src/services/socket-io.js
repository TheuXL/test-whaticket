import openSocket from "socket.io-client";
import { getBackendUrl } from "../config";

function connectToSocket() {
    const token = localStorage.getItem("token");
    const socket = openSocket(getBackendUrl(), {
      transports: ["websocket", "polling", "flashsocket"],
      query: {
        token: JSON.parse(token),
      },
    });

    // Capturar e silenciar erros específicos do socket
    socket.on("error", (error) => {
      // Silenciar o erro se for relacionado a tickets não encontrados
      if (error && error.message && (
          error.message.includes("ERR_NO_TICKET_FOUND") || 
          error.message.includes("Ticket não encontrado") || 
          error.message.includes("Ticket com ID") ||
          error.message.includes("No ticket found")
      )) {
        console.log("Silenciando erro de ticket não encontrado:", error.message);
        return;
      }
      
      // Para outros erros, exibir normalmente
      console.error("Socket error:", error);
    });

    return socket;
}

export default connectToSocket;