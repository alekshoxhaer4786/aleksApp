import React from 'react';
import ConfirmationNetworkSwitch from '.';

export default {
  title: 'Pages/Confirmations/Components/ConfirmationNetworkSwitch',
  argTypes: {
    toNetwork: { control: 'object' },
    fromNetwork: { control: 'object' },
  },
  args: {
    toNetwork: {
      chainId: '0xa',
      ticker: 'OP',
      name: 'Optimism',
      rpcUrl: 'https://optimism-mainnet.infura.io',
    },
    fromNetwork: {
      chainId: '1',
      ticker: 'ETH',
      name: 'Ethereum Mainnet',
    },
  },
};

export const DefaultStory = ({ toNetwork, fromNetwork }) => (
  <ConfirmationNetworkSwitch toNetwork={toNetwork} fromNetwork={fromNetwork} />
);

DefaultStory.storyName = 'Default';
