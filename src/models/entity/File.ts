import { Entity, Column, ObjectID, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class File {

  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  lastModified: number;

  @Column()
  lastModifiedDate: string;

  @Column()
  webkitRelativePath: string;

  @Column()
  name: string;

  @Column()
  size: number;

  @Column("text")
  description: string;

  @Column()
  type: string;

  @Column()
  isPublished: boolean;

  @Column()
  isPrivate: boolean;

  @Column()
  views: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

}
