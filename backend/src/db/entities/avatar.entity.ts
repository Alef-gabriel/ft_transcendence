import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Avatar from '../../avatar/interfaces/avatar.interface';

@Entity()
export class AvatarEntity implements Avatar {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;
}
