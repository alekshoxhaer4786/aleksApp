import { MultichainTransactionDetailsModal } from './multichain-transaction-details-modal';

export default {
  title: 'Components/App/MultichainTransactionDetailsModal',
  component: MultichainTransactionDetailsModal,
};

const mockTx = {
  type: 'send',
  status: 'confirmed',
  timestamp: new Date('Sep 30 2023 12:56').getTime(),
  id:
    'b93ea2cb4eed0f9e13284ed8860bcfc45de2488bb6a8b0b2a843c4b2fbce40f3',
  chain: 'bip122:000000000…… (truncated for brevity)',
};

const args = {
  transaction: mockTx,
};

export const Default = { args };
