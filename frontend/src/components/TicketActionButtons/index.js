import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import { IconButton } from "@material-ui/core";
import { MoreVert, Replay, PauseCircleOutline, PlayCircleOutline } from "@material-ui/icons";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import TicketOptionsMenu from "../TicketOptionsMenu";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";

const useStyles = makeStyles(theme => ({
	actionButtons: {
		marginRight: 6,
		flex: "none",
		alignSelf: "center",
		marginLeft: "auto",
		"& > *": {
			margin: theme.spacing(1),
		},
	},
}));

const TicketActionButtons = ({ ticket }) => {
	const classes = useStyles();
	const history = useHistory();
	const [anchorEl, setAnchorEl] = useState(null);
	const [loading, setLoading] = useState(false);
	const ticketOptionsMenuOpen = Boolean(anchorEl);
	const { user } = useContext(AuthContext);

	const handleOpenTicketOptionsMenu = e => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseTicketOptionsMenu = e => {
		setAnchorEl(null);
	};

	const handleUpdateTicketStatus = async (e, status, userId) => {
		setLoading(true);
		try {
			await api.put(`/tickets/${ticket.id}`, {
				status: status,
				userId: userId || null,
			});

			setLoading(false);
			if (status === "open") {
				history.push(`/tickets/${ticket.id}`);
			} else {
				history.push("/tickets");
			}
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	const handlePauseTicket = async () => {
		setLoading(true);
		try {
			await api.post(`/tickets/${ticket.id}/pause`);
			setLoading(false);
			history.push("/tickets");
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	const handleResumeTicket = async () => {
		setLoading(true);
		try {
			await api.post(`/tickets/${ticket.id}/resume`);
			setLoading(false);
			history.push(`/tickets/${ticket.id}`);
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	const handleReopenTicket = async () => {
		setLoading(true);
		try {
			await api.post(`/tickets/${ticket.id}/reopen`);
			setLoading(false);
			history.push(`/tickets/${ticket.id}`);
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
	};

	return (
		<div className={classes.actionButtons}>
			{ticket.status === "closed" && (
				<ButtonWithSpinner
					loading={loading}
					startIcon={<Replay />}
					size="small"
					onClick={handleReopenTicket}
				>
					{i18n.t("messagesList.header.buttons.reopen")}
				</ButtonWithSpinner>
			)}
			{ticket.status === "open" && (
				<>
					<ButtonWithSpinner
						loading={loading}
						startIcon={<Replay />}
						size="small"
						onClick={e => handleUpdateTicketStatus(e, "pending", null)}
					>
						{i18n.t("messagesList.header.buttons.return")}
					</ButtonWithSpinner>
					<ButtonWithSpinner
						loading={loading}
						size="small"
						variant="contained"
						color="primary"
						onClick={e => handleUpdateTicketStatus(e, "closed", user?.id)}
					>
						{i18n.t("messagesList.header.buttons.resolve")}
					</ButtonWithSpinner>
					<ButtonWithSpinner
						loading={loading}
						startIcon={<PauseCircleOutline />}
						size="small"
						onClick={handlePauseTicket}
					>
						{i18n.t("messagesList.header.buttons.pause")}
					</ButtonWithSpinner>
					<IconButton onClick={handleOpenTicketOptionsMenu}>
						<MoreVert />
					</IconButton>
					<TicketOptionsMenu
						ticket={ticket}
						anchorEl={anchorEl}
						menuOpen={ticketOptionsMenuOpen}
						handleClose={handleCloseTicketOptionsMenu}
					/>
				</>
			)}
			{ticket.status === "pending" && (
				<ButtonWithSpinner
					loading={loading}
					size="small"
					variant="contained"
					color="primary"
					onClick={e => handleUpdateTicketStatus(e, "open", user?.id)}
				>
					{i18n.t("messagesList.header.buttons.accept")}
				</ButtonWithSpinner>
			)}
			{ticket.status === "paused" && (
				<ButtonWithSpinner
					loading={loading}
					startIcon={<PlayCircleOutline />}
					size="small"
					variant="contained"
					color="primary"
					onClick={handleResumeTicket}
				>
					{i18n.t("messagesList.header.buttons.resume")}
				</ButtonWithSpinner>
			)}
		</div>
	);
};

export default TicketActionButtons;
