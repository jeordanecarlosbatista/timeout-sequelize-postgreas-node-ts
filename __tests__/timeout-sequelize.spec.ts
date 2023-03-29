import { Sequelize }  from 'sequelize';
import { config } from '../app.config';

const stub = { sequelize: (requestTimeout?: number) => {
    const {user, pass, host, port, db} = config;
    const dialectOptions: any = {};
    if(requestTimeout) {
        dialectOptions.statement_timeout = requestTimeout
    }
    return new Sequelize(`postgres://${user}:${pass}@${host}:${port}/${db}`, { dialectOptions: { ...dialectOptions }})
} }

it(`Given a database response time of 35 seconds
    And 15 seconds timeout configured
    Should return a timeout error when reaching 15 seconds of waiting`, async () => {
    const sequelize = stub.sequelize(5000)
    const promise = sequelize.query('SELECT public.totalrecords();')
    await expect(promise).rejects.toThrow()
}, 60000)  

it(`Given a database response time of 35 seconds
    And timeout of 0 seconds configured
    Should return success when after 35 seconds of waiting`, async () => {
    const sequelize = stub.sequelize(0)
    const [[result]] = await sequelize.query('SELECT public.totalrecords();')
    expect(result).toEqual({ totalrecords: 1 })
}, 60000)  

it(`Given a database response time of 35 seconds
    And no timeout configured
    Should return success when after 35 seconds of waiting`, async () => {
    const sequelize = stub.sequelize()
    const [[result]] = await sequelize.query('SELECT public.totalrecords();')
    expect(result).toEqual({ totalrecords: 1 })
}, 60000)  