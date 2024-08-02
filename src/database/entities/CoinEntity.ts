import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'

@Entity('coins')
export class CoinEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column('text')
    name: string;

    @Column('numeric')
    value: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}