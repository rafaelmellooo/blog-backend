import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { User } from '../users/user.entity';

@Entity({
  name: 'posts',
})
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
    unique: true,
  })
  title: string;

  @Column({ length: 100, unique: true })
  slug: string;

  @Column('text')
  body: string;

  @ManyToOne(
    () => User,
    user => user.posts,
    {
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  user: User;
}
