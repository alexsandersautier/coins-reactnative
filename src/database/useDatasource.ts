import {DataSource} from 'typeorm'
import { CoinEntity } from './entities/CoinEntity'
import * as SQLite from 'expo-sqlite/legacy';


export const dataSource = new DataSource({
    database: 'coins.db',
    entities: [CoinEntity],
    type: 'expo',
    driver: SQLite,
    synchronize: true
});