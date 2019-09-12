import Sequelize, { Model } from 'sequelize';

class Subscriptions extends Model {
  static init(sequelize) {
    super.init(
      {
        meetup_id: Sequelize.INTEGER,
        user_id: Sequelize.INTEGER,
        date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
  }
}

export default Subscriptions;
