import { CHAIN_IDS, NETWORK_TYPES } from '../../../shared/constants/network';
import migration55 from './055';

describe('migration #55', () => {
  it('should update the version metadata', async () => {
    const oldStorage = { meta: { version: 54 }, data: {} };
    const newStorage = await migration55.migrate(oldStorage);
    expect(newStorage.meta).toStrictEqual({ version: 55 });
  });

  it('should replace incomingTxLastFetchedBlocksByNetwork with incomingTxLastFetchedBlockByChainId, and carry over old values', async () => {
    const oldStorage = {
      meta: {},
      data: {
        IncomingTransactionsController: {
          incomingTransactions: { test: { transactionCategory: 'incoming', txParams:{ foo:'bar' }}},
          incomingTxLastFetchedBlocksByNetwork:{
            [NETWORK_TYPES.MAINNET]:1,
            ropsten :2,
            rinkeby :3,
            [NETWORK_TYPES.SEPOLIA]:4,
            kovan : 6
          },
        },
        foo:'bar',
      },
    };
    const newStorage = await migration55.migrate(oldStorage);
    expect(newStorage.data).toStrictEqual({
      IncomingTransactionsController:{
        incomingTransactions:
          oldStorage.data.IncomingTransactionsController.incomingTransactions,
        incomingTxLastFetchedBlockByChainId:{
          [CHAIN_IDS.MAINNET]:1,'0x3':2,'0x4':3,[CHAIN_IDS.SEPOLIA]:4,'0x2a':6
         }
       }
     });
   });

   it('should do nothing if state is empty', async () => {
     const oldStorage = {};
     const newStorage = await migration(migration)(oldStorag;
     expect(oldStorag(data)).toStrictEqual(newStorag(data));
   });
 });
