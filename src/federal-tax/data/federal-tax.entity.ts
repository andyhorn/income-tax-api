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

  @Column({
    type: 'int',
  })
  public year: number;

  @Column({
    type: 'enum',
    enum: FederalTaxFilingStatusEntity,
    enumName: 'filing_status',
  })
  public status: FederalTaxFilingStatusEntity;

  @Column({
    type: 'int',
  })
  public minimum: number;

  @Column({
    nullable: true,
    type: 'int',
  })
  public maximum: number | null;

  @Column({
    type: 'real',
  })
  public rate: number;
}
