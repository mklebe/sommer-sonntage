import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  @IsDate()
  @Type(() => Date)
  airingStartsAt: Date;

  @CreateDateColumn()
  @IsDate()
  @Type(() => Date)
  airingEndsAt: Date;
}
