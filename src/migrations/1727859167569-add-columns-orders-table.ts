
import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnsOrdersTable1727859167569 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add total_amount column
    await queryRunner.addColumn('order', new TableColumn({
      name: 'total_amount',
      type: 'varchar',
      isNullable: false,
      default: "'0'", // Wrap in quotes as it's a varchar
    }));

    // Add line_items column with type jsonb
    await queryRunner.addColumn('order', new TableColumn({
      name: 'line_items',
      type: 'jsonb', // Use jsonb for JSON data
      isNullable: true, // If you want to allow null values
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove total_amount column
    await queryRunner.dropColumn('order', 'total_amount');

    // Remove line_items column
    await queryRunner.dropColumn('order', 'line_items');
  }
}
