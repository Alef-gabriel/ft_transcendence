import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  displayName: string;

  @Column()
  profileUrl: string;

  @Column({ default: false })
  otpEnabled?: boolean;

  @Column({ nullable: true, default: false })
  otpValidated?: boolean;

  @Column({ nullable: true })
  otpSecret?: string;
}
