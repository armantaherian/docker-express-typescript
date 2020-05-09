import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { User } from "../models/entity/User";

export class CreateAdminUser1588715419085 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    let user = new User();
    user.username = "admin";
    user.password = "admin";
    user.hashPassword();
    user.role = "100";
    const userRepository = getRepository(User);
    await userRepository.save(user);
  }

  public async down(queryRunner: QueryRunner): Promise<any> { }
}
