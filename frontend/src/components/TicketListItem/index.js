import React, { useState, useEffect, useRef, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { parseISO, format, isSameDay } from "date-fns";
import clsx from "clsx";

import { 
	styled,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Typography,
	Avatar,
	Divider,
	Badge,
	Box,
	Tooltip,
	Chip,
	IconButton,
	alpha,
} from '@mui/material';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PersonIcon from '@mui/icons-material/Person';

import { green, grey, blue, yellow, red } from '@mui/material/colors';
import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import MarkdownWrapper from "../MarkdownWrapper";
import { AuthContext } from "../../context/Auth/AuthContext";
import toastError from "../../errors/toastError";
import { useTheme } from "@mui/material/styles";

const TicketItemRoot = styled(ListItem)(({ theme, selected, status }) => ({
	position: "relative",
	height: "80px",
	borderLeft: "4px solid transparent",
	borderBottom: `1px solid ${theme.palette.divider}`,
	paddingLeft: theme.spacing(3),
	paddingRight: theme.spacing(2),
	transition: 'all 0.3s ease',
	cursor: status === "pending" ? "default" : "pointer",
	backgroundColor: selected ? alpha(theme.palette.primary.main, 0.08) : "inherit",
	borderLeftColor: selected ? theme.palette.primary.main : "transparent",
	"&:hover": {
		backgroundColor: status !== "pending" 
			? alpha(theme.palette.primary.main, 0.04) 
			: "inherit",
	},
}));

const MessageText = styled(Typography)(({ theme }) => ({
	maxWidth: '100%',
	display: 'inline-block',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
}));

const StatusBadge = styled(Box)(({ theme, color }) => ({
	position: "absolute",
	width: "8px",
	height: "8px",
	borderRadius: "50%",
	top: theme.spacing(4.2),
	left: theme.spacing(1.2),
	backgroundColor: color,
}));

const MessageBadge = styled(Badge)(({ theme }) => ({
	"& .MuiBadge-badge": {
		backgroundColor: theme.palette.primary.main,
	}
}));

const QueueTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .MuiTooltip-arrow`]: {
		color: theme.palette.primary.main,
	},
	[`& .MuiTooltip-tooltip`]: {
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.primary.contrastText,
		boxShadow: theme.shadows[1],
		fontSize: 12,
	},
}));

const UserChip = styled(Chip)(({ theme }) => ({
	position: "absolute",
	bottom: theme.spacing(0.5),
	right: theme.spacing(1),
	height: 22,
	fontSize: '0.75rem',
}));

const TicketListItem = ({ ticket }) => {
	const theme = useTheme();
	const history = useHistory();
	const [loading, setLoading] = useState(false);
	const { ticketId } = useParams();
	const isMounted = useRef(true);
	const { user } = useContext(AuthContext);

	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	const handleAcepptTicket = async id => {
		setLoading(true);
		try {
			await api.put(`/tickets/${id}`, {
				status: "open",
				userId: user?.id,
			});
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
		if (isMounted.current) {
			setLoading(false);
		}
		history.push(`/tickets/${id}`);
	};

	const handleSelectTicket = id => {
		history.push(`/tickets/${id}`);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "open":
				return theme.palette.primary.main;
			case "pending":
				return yellow[600];
			case "closed":
				return green[500];
			default:
				return grey[500];
		}
	};

	return (
		<React.Fragment key={ticket.id}>
			<TicketItemRoot
				button
				onClick={e => {
					if (ticket.status === "pending") return;
					handleSelectTicket(ticket.id);
				}}
				selected={ticketId && +ticketId === ticket.id}
				status={ticket.status}
			>
				<StatusBadge color={getStatusColor(ticket.status)} />
				
				<ListItemAvatar>
					<Avatar 
						src={ticket?.contact?.profilePicUrl} 
						alt={ticket.contact.name}
						sx={{ 
							width: 50, 
							height: 50, 
							boxShadow: theme.shadows[2],
						}}
					/>
				</ListItemAvatar>
				
				<ListItemText
					disableTypography
					primary={
						<Box 
							sx={{ 
								display: 'flex', 
								justifyContent: 'space-between', 
								alignItems: 'center',
								mb: 0.5, 
							}}
						>
							<Typography
								variant="subtitle2"
								noWrap
								sx={{ 
									fontWeight: 600, 
									maxWidth: ticket.status === 'pending' ? '70%' : '85%',
								}}
							>
								{ticket.contact.name}
							</Typography>
							
							<Typography
								variant="caption"
								component="span"
								color="textSecondary"
							>
								{format(parseISO(ticket.updatedAt), "HH:mm")}
							</Typography>
						</Box>
					}
					secondary={
						<Box>
							<MessageText
								variant="body2"
								color="textSecondary"
								sx={{ 
									width: ticket.status === 'pending' ? '70%' : '85%',
								}}
							>
								{ticket.lastMessage ? (
									<MarkdownWrapper>
										{ticket.lastMessage}
									</MarkdownWrapper>
								) : (
									<span>
										{i18n.t("ticketsList.noMessages")}
									</span>
								)}
							</MessageText>
						</Box>
					}
				/>
				
				{ticket.status === "pending" && (
					<ButtonWithSpinner
						color="primary"
						variant="contained"
						size="small"
						loading={loading}
						onClick={e => {
							e.stopPropagation();
							handleAcepptTicket(ticket.id);
						}}
						sx={{ 
							ml: 1, 
							minWidth: 'auto', 
							boxShadow: theme.shadows[1],
						}}
					>
						{i18n.t("ticketsList.buttons.accept")}
					</ButtonWithSpinner>
				)}
				
				{ticket.status !== "pending" && ticket.unreadMessages > 0 && (
					<MessageBadge
						badgeContent={ticket.unreadMessages}
						color="primary"
						sx={{ ml: 2 }}
					/>
				)}
				
				{ticket.status === "open" && ticket.user && ticket.user.id === user?.id && (
					<UserChip
						size="small"
						variant="outlined"
						color="primary"
						icon={<PersonIcon fontSize="small" />}
						label={i18n.t("ticketsList.assignedTo.you")}
					/>
				)}
				
				{ticket.status === "open" && ticket.user && ticket.user.id !== user?.id && (
					<UserChip
						size="small"
						variant="outlined"
						color="secondary"
						icon={<PersonIcon fontSize="small" />}
						label={ticket.user.name}
					/>
				)}
				
				<QueueTooltip
					title={ticket.queue?.name || i18n.t("ticketsList.noQueue")}
					placement="right"
				>
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							right: 0,
							width: 5,
							backgroundColor: ticket.queue?.color || grey[400],
						}}
					/>
				</QueueTooltip>
			</TicketItemRoot>
		</React.Fragment>
	);
};

export default TicketListItem;
