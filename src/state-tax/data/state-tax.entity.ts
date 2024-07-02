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

  @Column({
    type: 'int',
  })
  public income: number;

  @Column({
    type: 'real',
  })
  public rate: number;

  @Column({
    type: 'int',
  })
  public year: number;
}
