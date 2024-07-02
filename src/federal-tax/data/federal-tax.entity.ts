import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum FederalTaxFilingStatusEntity {
  SINGLE = 'SINGLE',
  JOINT = 'JOINT',
  HEAD = 'HEAD',
}

@Entity('federal_tax_brackets')
export class FederalTaxBracketEntity {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public year: number;

  @Column({
    type: 'enum',
    enum: FederalTaxFilingStatusEntity,
    enumName: 'filing_status',
  })
  public status: FederalTaxFilingStatusEntity;

  @Column()
  public minimum: number;

  @Column({
    nullable: true,
  })
  public maximum: number | null;

  @Column({
    type: 'real',
  })
  public rate: number;
}
