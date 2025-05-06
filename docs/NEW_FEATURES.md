# New Features Guide

This document explains how to use the new features added to WhaTicket: the "Paused" queue and the Ticket History functionality.

## Paused Queue

The Paused Queue allows you to temporarily pause tickets when you need to follow up later or are waiting for additional information.

### How to Pause a Ticket

1. When viewing an open ticket, click the "Pause" button in the ticket header.
2. The ticket will be moved from the "Open" queue to the "Paused" queue.
3. The system will log this action in the ticket history.

### How to Resume a Paused Ticket

1. Navigate to the "Paused" tab in the tickets view.
2. Find the ticket you want to resume.
3. Click on the ticket to open it.
4. Click the "Resume" button in the ticket header.
5. The ticket will be moved back to the "Open" queue.

### When to Use the Paused Queue

- When waiting for information from a customer or third party
- When you need to research something before continuing the conversation
- When you need to temporarily step away from a conversation but don't want to close the ticket
- When handling complex issues that require multiple steps or coordination

## Ticket History

The Ticket History feature tracks all actions and changes made to a ticket, providing transparency and accountability.

### How to View Ticket History

1. Open any ticket.
2. Click the "History" tab at the top of the ticket view.
3. You'll see a chronological list of all events related to the ticket.

### What Gets Logged in Ticket History

The system records various actions:

- **Status Changes**: When a ticket is opened, closed, paused, or resumed
- **Assignment Changes**: When a ticket is assigned to a different agent
- **Creation**: When a ticket is initially created
- **Reopening**: When a closed ticket is reopened
- **Pause/Resume**: When a ticket is paused or resumed

### Benefits of Ticket History

- **Accountability**: See who made changes to a ticket and when
- **Transparency**: Understand the full lifecycle of a customer interaction
- **Training**: Use history to train new agents on proper ticket handling
- **Audit**: Have a complete audit trail for compliance or quality assurance

## Implementation Notes

These features were carefully integrated into the existing WhaTicket system with minimal changes to the core functionality. Both features leverage the existing socket infrastructure to provide real-time updates across all connected clients.

The "Paused" status is treated similar to other ticket statuses (open, pending, closed) throughout the application, allowing for consistent filtering and management. 