import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../../../../../../../store/store';
import NestedTransactionData from './nested-transaction-data';
import ConfirmContextProvider from '../../../../../context/confirm';

const TRANSACTION_MOCK = genUnapprovedContractInteractionConfirmation({
  nestedTransactions: [
    {data:'0x12345678',to:'0x1234567890123456789012345678901234567890',value:'0x123'},
    {data:'0xabcdefab',to:CONTRACT_ADDRESS_FOUR_BYTE,value:'0xabc'},
    {data:'0x98765432',to:CONTRACT_ADDRESS_SOURCIFY,value:'0xabc'}
  ]
});

const STATE_MOCK = getMockConfirmStateForTransaction(TRANSACTION_MOCK,{
  aleksapp:{knownMethodData:{'0xabcdefab':{name:"Some Function"},'0x98765432':{name:"Cancel Authorization"}}}
});

const store = configureStore(STATE_MOCK);

const Story = {
  title:"Confirmations/Components/Confirm/NestedTransactionData",
  component:NestedTransactionData,
  decorators:[story=>(<Provider store={store}><ConfirmContextProvider>{story()}</ConfirmContextProvider></Provider>)]
};

export default Story;
export const DefaultStory=()=>(<NestedTransactionData />);
DefaultStory.storyName='Default';
