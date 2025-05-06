import React, { useContext, useEffect, useState } from "react";
import { 
	Paper, 
	Container, 
	Grid, 
	Typography, 
	Card, 
	CardContent, 
	Box, 
	Divider, 
	useTheme,
	Stack,
	ButtonGroup,
	Button,
	alpha,
	IconButton,
	Tooltip,
} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MessageIcon from '@mui/icons-material/Message';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

import { styled } from '@mui/material/styles';
import useTickets from "../../hooks/useTickets";
import { AuthContext } from "../../context/Auth/AuthContext";
import { i18n } from "../../translate/i18n";
import Chart from "./Chart";

const HeaderBox = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	marginBottom: theme.spacing(3),
}));

const MetricCard = styled(Card)(({ theme }) => ({
	height: '100%',
	transition: 'transform 0.3s, box-shadow 0.3s',
	'&:hover': {
		transform: 'translateY(-4px)',
		boxShadow: theme.shadows[4],
	},
}));

const IconBox = styled(Box)(({ theme, color }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	width: 48,
	height: 48,
	borderRadius: '50%',
	backgroundColor: alpha(theme.palette[color].main, 0.1),
	color: theme.palette[color].main,
	marginBottom: theme.spacing(1),
}));

const Dashboard = () => {
	const theme = useTheme();
	const { user } = useContext(AuthContext);
	const [ticketStats, setTicketStats] = useState({
		open: 0,
		pending: 0,
		closed: 0,
		unread: 0,
	});
	const [timeFilter, setTimeFilter] = useState('today');
	const [isLoading, setIsLoading] = useState(false);

	let userQueueIds = [];

	if (user.queues && user.queues.length > 0) {
		userQueueIds = user.queues.map(q => q.id);
	}

	// Chamando hooks diretamente no nível do componente
	const { count: openCount } = useTickets({
		status: "open",
		showAll: true,
		withUnreadMessages: false,
		queueIds: JSON.stringify(userQueueIds)
	});

	const { count: pendingCount } = useTickets({
		status: "pending",
		showAll: true,
		withUnreadMessages: false,
		queueIds: JSON.stringify(userQueueIds)
	});

	const { count: closedCount } = useTickets({
		status: "closed",
		showAll: true,
		withUnreadMessages: false,
		queueIds: JSON.stringify(userQueueIds)
	});

	const { count: unreadCount } = useTickets({
		status: "open",
		showAll: true,
		withUnreadMessages: true,
		queueIds: JSON.stringify(userQueueIds)
	});

	const fetchTicketStats = () => {
		setIsLoading(true);
		setTicketStats({
			open: openCount,
			pending: pendingCount,
			closed: closedCount,
			unread: unreadCount,
		});
		setIsLoading(false);
	};

	useEffect(() => {
		fetchTicketStats();
	}, [openCount, pendingCount, closedCount, unreadCount, timeFilter]);

	const handleRefresh = () => {
		fetchTicketStats();
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<HeaderBox>
				<Typography variant="h4" component="h1" fontWeight="bold">
					{i18n.t("dashboard.title")}
				</Typography>
				
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<ButtonGroup variant="outlined" size="small">
						<Button 
							onClick={() => setTimeFilter('today')}
							variant={timeFilter === 'today' ? 'contained' : 'outlined'}
						>
							{i18n.t("dashboard.filters.today")}
						</Button>
						<Button 
							onClick={() => setTimeFilter('week')}
							variant={timeFilter === 'week' ? 'contained' : 'outlined'}
						>
							{i18n.t("dashboard.filters.week")}
						</Button>
						<Button 
							onClick={() => setTimeFilter('month')}
							variant={timeFilter === 'month' ? 'contained' : 'outlined'}
						>
							{i18n.t("dashboard.filters.month")}
						</Button>
					</ButtonGroup>
					
					<Tooltip title={i18n.t("dashboard.buttons.refresh")}>
						<IconButton onClick={handleRefresh} disabled={isLoading}>
							<RefreshIcon />
						</IconButton>
					</Tooltip>
				</Box>
			</HeaderBox>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				<Grid item xs={12} sm={6} md={3}>
					<MetricCard elevation={2}>
						<CardContent>
							<Stack
								direction="row"
								alignItems="center"
								justifyContent="space-between"
								sx={{ mb: 2 }}
							>
								<IconBox color="primary">
									<MessageIcon />
								</IconBox>
								<AccessTimeIcon color="action" fontSize="small" />
							</Stack>
							
							<Typography variant="h4" component="div" fontWeight="bold">
								{ticketStats.open}
							</Typography>
							
							<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
								{i18n.t("dashboard.cards.active.title")}
							</Typography>
							
							<Divider sx={{ my: 1 }} />
							
							<Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1 }}>
								<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									<TrendingUpIcon fontSize="inherit" color="success" />
									{i18n.t("dashboard.cards.active.subtitle")}
								</Box>
							</Typography>
						</CardContent>
					</MetricCard>
				</Grid>
				
				<Grid item xs={12} sm={6} md={3}>
					<MetricCard elevation={2}>
						<CardContent>
							<Stack
								direction="row"
								alignItems="center"
								justifyContent="space-between"
								sx={{ mb: 2 }}
							>
								<IconBox color="warning">
									<HourglassEmptyIcon />
								</IconBox>
								<AccessTimeIcon color="action" fontSize="small" />
							</Stack>
							
							<Typography variant="h4" component="div" fontWeight="bold">
								{ticketStats.pending}
							</Typography>
							
							<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
								{i18n.t("dashboard.cards.waiting.title")}
							</Typography>
							
							<Divider sx={{ my: 1 }} />
							
							<Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1 }}>
								<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									<TrendingUpIcon fontSize="inherit" color="warning" />
									{i18n.t("dashboard.cards.waiting.subtitle")}
								</Box>
							</Typography>
						</CardContent>
					</MetricCard>
				</Grid>
				
				<Grid item xs={12} sm={6} md={3}>
					<MetricCard elevation={2}>
						<CardContent>
							<Stack
								direction="row"
								alignItems="center"
								justifyContent="space-between"
								sx={{ mb: 2 }}
							>
								<IconBox color="success">
									<CheckCircleOutlineIcon />
								</IconBox>
								<AccessTimeIcon color="action" fontSize="small" />
							</Stack>
							
							<Typography variant="h4" component="div" fontWeight="bold">
								{ticketStats.closed}
							</Typography>
							
							<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
								{i18n.t("dashboard.cards.closed.title")}
							</Typography>
							
							<Divider sx={{ my: 1 }} />
							
							<Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1 }}>
								<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									<TrendingUpIcon fontSize="inherit" color="success" />
									{i18n.t("dashboard.cards.closed.subtitle")}
								</Box>
							</Typography>
						</CardContent>
					</MetricCard>
				</Grid>
				
				<Grid item xs={12} sm={6} md={3}>
					<MetricCard elevation={2}>
						<CardContent>
							<Stack
								direction="row"
								alignItems="center"
								justifyContent="space-between"
								sx={{ mb: 2 }}
							>
								<IconBox color="error">
									<MarkUnreadChatAltIcon />
								</IconBox>
								<AccessTimeIcon color="action" fontSize="small" />
							</Stack>
							
							<Typography variant="h4" component="div" fontWeight="bold">
								{ticketStats.unread}
							</Typography>
							
							<Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
								{i18n.t("dashboard.cards.unread.title")}
							</Typography>
							
							<Divider sx={{ my: 1 }} />
							
							<Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1 }}>
								<Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
									<TrendingUpIcon fontSize="inherit" color="error" />
									{i18n.t("dashboard.cards.unread.subtitle")}
								</Box>
							</Typography>
						</CardContent>
					</MetricCard>
				</Grid>
			</Grid>

			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Card elevation={2}>
						<CardContent>
							<Typography variant="h6" component="h2" gutterBottom>
								{i18n.t("dashboard.charts.perDay.title")}
							</Typography>
							<Box sx={{ height: 300 }}>
								<Chart />
							</Box>
						</CardContent>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Dashboard;