import { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Modificar a coluna createdAt para ter um valor padrão
    await queryInterface.sequelize.query(`
      ALTER TABLE \`TicketLogs\` 
      MODIFY COLUMN \`createdAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    `);
    
    // Modificar a coluna updatedAt para ter um valor padrão
    await queryInterface.sequelize.query(`
      ALTER TABLE \`TicketLogs\` 
      MODIFY COLUMN \`updatedAt\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    `);
    
    console.log("Migração executada: corrigidos os valores padrão de timestamp na tabela TicketLogs");
    return Promise.resolve();
  },

  down: async (queryInterface: QueryInterface) => {
    // Reverter para as definições anteriores
    await queryInterface.sequelize.query(`
      ALTER TABLE \`TicketLogs\` 
      MODIFY COLUMN \`createdAt\` DATETIME NOT NULL
    `);
    
    await queryInterface.sequelize.query(`
      ALTER TABLE \`TicketLogs\` 
      MODIFY COLUMN \`updatedAt\` DATETIME NOT NULL
    `);
    
    return Promise.resolve();
  }
}; 