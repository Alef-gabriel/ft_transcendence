import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AvatarEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;
}
