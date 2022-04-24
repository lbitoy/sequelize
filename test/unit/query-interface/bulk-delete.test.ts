import { DataTypes } from '@sequelize/core';
import { expect } from 'chai';
import sinon from 'sinon';
import { expectsql, sequelize } from '../../support';

describe('QueryInterface#bulkDelete', () => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING,
  }, { timestamps: false });

  afterEach(() => {
    sinon.restore();
  });

  // you'll find more replacement tests in query-generator tests
  it('does not parse replacements outside of raw sql', async () => {
    const stub = sinon.stub(sequelize, 'queryRaw');

    await sequelize.getQueryInterface().bulkDelete(
      User.tableName,
      { id: ':id' },
      {
        replacements: {
          limit: 1,
          id: '123',
        },
      },
      User,
    );

    expect(stub.callCount).to.eq(1);
    const firstCall = stub.getCall(0);
    expectsql(firstCall.args[0] as string, {
      default: `DELETE FROM [Users] WHERE [id] = ':id';`,
      mssql: `DELETE FROM [Users] WHERE [id] = N':id'; SELECT @@ROWCOUNT AS AFFECTEDROWS;`,
    });

    expect(firstCall.args[1]?.bind).to.be.undefined;
  });
});
