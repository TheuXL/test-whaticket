import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  CircularProgress, 
  IconButton, 
  Box 
} from "@material-ui/core";
import { 
  History as HistoryIcon, 
  Person as PersonIcon, 
  SwapHoriz as SwapHorizIcon, 
  CheckCircle as CheckCircleIcon, 
  PauseCircleFilled as PauseIcon,
  PlayCircleFilled as PlayIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  Done as DoneIcon
} from "@material-ui/icons";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import openSocket from "../../services/socket-io";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
  },
  header: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1),
  },
  headerIcon: {
    marginRight: theme.spacing(1),
  },
  ticketInfo: {
    marginBottom: theme.spacing(2),
  },
  noRecords: {
    display: "flex",
    justifyContent: "center",
    padding: theme.spacing(2),
    fontStyle: "italic",
    color: "rgba(0, 0, 0, 0.6)",
  },
  logItem: {
    borderLeft: "3px solid #ccc",
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  logTime: {
    fontSize: "0.75rem",
    color: "rgba(0, 0, 0, 0.6)",
  },
  logUser: {
    fontWeight: "bold",
  },
  statusBadge: {
    borderRadius: 2,
    padding: "2px 6px",
    fontSize: "0.75rem",
    marginRight: theme.spacing(1),
    fontWeight: "bold",
  },
  pending: {
    backgroundColor: theme.palette.warning.light,
    color: theme.palette.warning.main,
  },
  open: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.main,
  },
  closed: {
    backgroundColor: theme.palette.grey[400],
    color: theme.palette.grey[700],
  },
  paused: {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.info.main,
  },
  logIcon: {
    marginRight: theme.spacing(1),
    fontSize: "1.3rem",
    verticalAlign: "bottom",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing(4),
  },
}));

const TicketLogs = ({ ticketId, refresh }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  const fetchTicketLogs = async () => {
    if (!ticketId) return;
    
    try {
      setLoading(true);
      console.log(`Buscando logs para o ticket ${ticketId}`);
      const { data } = await api.get(`/tickets/${ticketId}/logs`);
      console.log("Resposta da API:", data);
      setLogs(data);
    } catch (err) {
      console.error("Erro ao buscar logs:", err);
      if (err.response) {
        console.error("Detalhes do erro:", err.response.data);
      }
      toastError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketLogs();
  }, [ticketId, refresh]);

  useEffect(() => {
    if (!ticketId) return;
    
    // Configurar o WebSocket para receber atualizações de logs
    const socket = openSocket();
    
    socket.on("connect", () => {
      console.log("TicketLogs WebSocket connected");
      socket.emit("joinChatBox", ticketId);
      socket.emit("joinTicket", ticketId);
      // Adicionar canal específico para logs do ticket
      socket.emit("join", `ticket:${ticketId}`);
      socket.emit("join", ticketId.toString());
    });

    socket.on("ticket:log", (data) => {
      console.log("ticket:log event received", data);
      if (data.action === "create") {
        setLogs((prevLogs) => {
          // Verificar se o log já existe na lista para evitar duplicatas
          const exists = prevLogs.some(log => log.id === data.ticketLog.id);
          if (exists) return prevLogs;
          return [data.ticketLog, ...prevLogs];
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [ticketId]);

  const renderStatusBadge = (status) => {
    if (!status) return null;

    let className;
    switch (status) {
      case "open":
        className = classes.open;
        break;
      case "pending":
        className = classes.pending;
        break;
      case "closed":
        className = classes.closed;
        break;
      case "paused":
        className = classes.paused;
        break;
      default:
        className = "";
    }

    return (
      <span className={`${classes.statusBadge} ${className}`}>
        {status}
      </span>
    );
  };

  const renderLogIcon = (type) => {
    switch (type) {
      case "statusChange":
        return <SwapHorizIcon className={classes.logIcon} />;
      case "userChange":
        return <PersonIcon className={classes.logIcon} />;
      case "pause":
        return <PauseIcon className={classes.logIcon} color="primary" />;
      case "resume":
        return <PlayIcon className={classes.logIcon} color="primary" />;
      case "create":
        return <AddIcon className={classes.logIcon} color="primary" />;
      case "reopen":
        return <RefreshIcon className={classes.logIcon} color="secondary" />;
      case "close":
        return <DoneIcon className={classes.logIcon} style={{ color: "#388e3c" }} />;
      default:
        return <HistoryIcon className={classes.logIcon} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), "dd/MM/yyyy HH:mm", { locale: pt });
  };

  if (loading) {
    return (
      <div className={classes.center}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Paper variant="outlined" className={classes.paper}>
        <div className={classes.header}>
          <HistoryIcon className={classes.headerIcon} />
          <Typography variant="subtitle1">
            {i18n.t("ticketLogs.title")}
          </Typography>
        </div>

        {logs.length === 0 ? (
          <div className={classes.noRecords}>
            {i18n.t("ticketLogs.noLogsMessage")}
          </div>
        ) : (
          <List>
            {logs.map((log) => (
              <React.Fragment key={log.id}>
                <ListItem className={classes.logItem}>
                  <ListItemText
                    primary={
                      <>
                        {renderLogIcon(log.type)}
                        {log.description}
                      </>
                    }
                    secondary={
                      <Box mt={1}>
                        {log.oldStatus && log.newStatus && (
                          <Box mb={0.5}>
                            {renderStatusBadge(log.oldStatus)}
                            {" → "}
                            {renderStatusBadge(log.newStatus)}
                          </Box>
                        )}
                        <Typography component="span" className={classes.logTime}>
                          {formatTimestamp(log.timestamp)}
                          {log.user && (
                            <>
                              {" • "}
                              <span className={classes.logUser}>
                                {log.user.name}
                              </span>
                            </>
                          )}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider component="li" variant="inset" />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </div>
  );
};

export default TicketLogs; 