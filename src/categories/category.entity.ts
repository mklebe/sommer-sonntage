import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

interface Song {
  artist: string;
  title: string;
}

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @CreateDateColumn()
  @IsDate()
  @Type(() => Date)
  airingStartsAt: Date;

  @CreateDateColumn()
  @IsDate()
  @Type(() => Date)
  airingEndsAt: Date;

  get isRunning(): boolean {
    const now = new Date();
    return now > this.airingStartsAt && now < this.airingEndsAt;
  }

  get isUpcoming(): boolean {
    const now = new Date();
    return now < this.airingStartsAt;
  }

  get isFinished(): boolean {
    const now = new Date();
    return now > this.airingEndsAt;
  }
}

export type CategoryDto = Omit<
  Category,
  'id' | 'isFinished' | 'isUpcoming' | 'isRunning'
>;
