import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  DataType
} from "sequelize-typescript";

import Ticket from "./Ticket";
import User from "./User";

@Table
class TicketLog extends Model<TicketLog> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => Ticket)
  @Column
  ticketId: number;

  @BelongsTo(() => Ticket)
  ticket: Ticket;

  @ForeignKey(() => User)
  @Column({
    allowNull: true
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @Column
  type: string;

  @Column({
    allowNull: true
  })
  oldStatus: string;

  @Column({
    allowNull: true
  })
  newStatus: string;

  @Column({
    allowNull: true
  })
  oldUserId: number;

  @Column({
    allowNull: true
  })
  newUserId: number;

  @Column({ 
    type: DataType.TEXT,
    allowNull: true
  })
  description: string;

  @Column
  timestamp: Date;
  
  @CreatedAt
  createdAt: Date;
  
  @UpdatedAt
  updatedAt: Date;
}

export default TicketLog; 