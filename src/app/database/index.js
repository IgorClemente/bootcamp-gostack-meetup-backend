import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../models/User';
import File from '../models/File';
import Meetup from '../models/Meetup';

const models = [User, File, Meetup];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
  }
}

export default new Database();
