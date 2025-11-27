import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const getTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
    type: "postgres",
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + "/**/*.entity{.ts,.js}"],
    synchronize: true, // Auto-create tables (disable in production!)
    migrationsTableName: "migrations",
    migrations: [__dirname + "/migrations/*{.ts,.js}"],
});