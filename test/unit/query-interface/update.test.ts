import { DataTypes } from '@sequelize/core';
import { expect } from 'chai';
import sinon from 'sinon';
import { expectsql, sequelize } from '../../support';

describe('QueryInterface#update', () => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
  }, { timestamps: false });

  afterEach(() => {
    sinon.restore();
  });

  // you'll find more replacement tests in query-generator tests
  it('does not parse replacements outside of raw sql', async () => {
    const stub = sinon.stub(sequelize, 'queryRaw');

    const instance = new User();

    await sequelize.getQueryInterface().update(
      instance,
      User.tableName,
      { firstName: ':name' },
      { id: ':id' },
      {
        returning: [':data'],
        replacements: {
          name: 'Zoe',
          data: 'abc',
        },
      },
    );

    expect(stub.callCount).to.eq(1);
    const firstCall = stub.getCall(0);
    expectsql(firstCall.args[0] as string, {
      postgres: 'UPDATE "Users" SET "firstName"=$1 WHERE "id" = $2 RETURNING ":data";',
      default: 'UPDATE [Users] SET [firstName]=? WHERE [id] = ?;',
    });
    expect(firstCall.args[1]?.bind).to.deep.eq([':name', ':id']);
  });
});
