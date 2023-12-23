'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'example@example.com',
      password: '123456',
      firstName: 'Admin',
      lastName: 'Lumine',
      address: 'Ho Chi Minh',
      phonenumber: '0988832147',
      gender: 0,
      image: 'Default Image',
      positionId: 'S1',
      roleId: 'R1',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
