import "reflect-metadata"
import { DataSource } from "typeorm"
import { AddBook } from "./entity/addBooks"
import { AddAdmin } from "./entity/addAdmin"
import { AddMember} from './entity/addMember'
import { AddRegistry } from "./entity/addRegistry"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root123",
    database: "books",
    synchronize: true,
    logging: false,
    entities: [AddBook, AddAdmin, AddMember, AddRegistry],
    migrations: [],
    subscribers: [],
})