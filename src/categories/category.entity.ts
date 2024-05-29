import { Type } from 'class-transformer';
import { IsDate } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

interface Song {
  artist: string;
  title: string;
}

export interface BoardLineItemDto extends Song {
  placement: number;
}
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @OneToMany(() => BoardLineItem, (boardLineItem) => boardLineItem.category, {
    eager: true,
  })
  board: BoardLineItem[];

  @CreateDateColumn()
  @IsDate()
  @Type(() => Date)
  airingStartsAt: Date;

  @CreateDateColumn()
  @IsDate()
  @Type(() => Date)
  airingEndsAt: Date;

  @Column({ nullable: true })
  finishedListUrl?: string;
}

@Entity()
export class BoardLineItem implements BoardLineItemDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  artist: string;

  @Column()
  title: string;

  @Column()
  placement: number;

  @ManyToOne(() => Category, (category) => category.board)
  category: Category;
}

export type CategoryDto = Omit<Category, 'id'>;
