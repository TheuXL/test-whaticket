import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // The 'status' field is implemented as a string type in the Ticket model, not an enum in the database.
    // This migration is just a placeholder to document the addition of the 'paused' status.
    // No schema changes are needed since the application will handle validation of the new status.
    console.log("Migration executed: add-paused-status-to-tickets");
    return Promise.resolve();
  },

  down: async (queryInterface: QueryInterface) => {
    // No changes to revert
    return Promise.resolve();
  }
}; 