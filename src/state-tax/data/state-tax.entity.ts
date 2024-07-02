import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum StateTaxFilingStatusEntity {
  SINGLE = 'SINGLE',
  JOINT = 'JOINT',
}

@Entity('state_tax_brackets')
export class StateTaxEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public state: string;

  @Column({
    name: 'status',
    enum: StateTaxFilingStatusEntity,
    enumName: 'state_filing_status',
  })
  public filingStatus: StateTaxFilingStatusEntity;

  @Column()
  public income: number;

  @Column()
  public rate: number;

  @Column()
  public year: number;
}
