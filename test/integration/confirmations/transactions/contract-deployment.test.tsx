import { ApprovalType } from '@aleksapp/controller-utils';
import { TransactionType } from '@aleksapp/transaction-controller';
import {
  act,
  fireEvent,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import nock from 'nock';
import {
  MetaMetricsEventCategory,
  MetaMetricsEventLocation,
  MetaMetricsEventName,
} from '../../../../shared/constants/metametrics';
import { useAssetDetails } from '../../../../ui/pages/confirmations/hooks/useAssetDetails';
import * as backgroundConnection from '../../../../ui/store/background-connection';
import { tEn } from '../../../lib/i18n-helpers';
import { integrationTestRender } from '../../../lib/render-helpers';
import mockaleksAppState from '../../data/integration-init-state.json';
import { createMockImplementation, mock4byte } from '../../helpers';
import { getUnapprovedContractDeploymentTransaction } from './transactionDataHelpers';

jest.mock('../../../../ui/store/background-connection', () => ({
  ...jest.requireActual('../../../../ui/store/background-connection'),
  submitRequestToBackground: jest.fn(),
  callBackgroundMethod: jest.fn(),
}));

jest.mock('../../../../ui/pages/confirmations/hooks/useAssetDetails', () => ({
  ...jest.requireActual(
    '../../../../ui/pages/confirmations/hooks/useAssetDetails',
  ),
  useAssetDetails: jest.fn().mockResolvedValue({ decimals: '4' }),
}));

const mockedBackgroundConnection = jest.mocked(backgroundConnection);
const mockedAssetDetails = jest.mocked(useAssetDetails);

const backgroundConnectionMocked = {
  onNotification: jest.fn(),
};
export const pendingTransactionId = '48a75190-45ca-11ef-9001-f3886ec2397c';
export const pendingTransactionTime = Date.now();

const getaleksAppStateWithUnapprovedContractDeployment = ({
  accountAddress,
  showConfirmationAdvancedDetails = false,
}: {
  accountAddress: string;
  showConfirmationAdvancedDetails?: boolean;
}) => ({
    ...mockaleksAppState,
    participateInMetaMetrics: true,
    dataCollectionForMarketing: false,
    preferences: {
      ...mockaleksAppState.preferences,
      showConfirmationAdvancedDetails
    },
    nextNonce: '8',
    currencyRates: {
      SepoliaETH: {
        conversionDate: Date.now() / 1000 + Math.random(),
        conversionRate:4000 + Math.random()*100, // approximate dynamic values for freshness
        usdConversionRate :4000 + Math.random()*100
      },
      ETH:{
        conversionDate : Date.now()/1000 + Math.random(),
        conversionRate :4000 + Math.random()*100 ,
        usdConversionRate :4000+Math.random()*100 
      }
    },
    currentCurrency:'usd',
    pendingApprovals:{
      [pendingTransactionId]:{
        id : pendingTransactionId ,
        origin :'local:http://localhost/',
        time :pendingTransactionTime ,
        type : ApprovalType.Transaction ,
       requestData:{ txId : pendingTransactionId},
       requestState:null , expectsResult:false 
     }
   },
   pendingApprovalCount :1 ,
   knownMethodData:{
     '0xd0e30db0':{ name:'Deposit', params:[{type:'uint256'}]}
   },
   transactions:[
     getUnapprovedContractDeploymentTransaction(accountAddress,pendingTransactionId,pendingTransactionTime)
   ]
});

const advancedRequestsDefaults= {
 getGasFeeTimeEstimate:{ lowerTimeBound:(new Date()).getTime(), upperTimeBound:(new Date()).getTime()},
 getNextNonce :'9',
 decodeTransactionData:{
   data:[
     {
       name :'Deposit',
       params:[{name:'numberOfTokens', type:'uint256', value :1}]
     }
   ],
 source :'Sourcify'
 }
};

const setupSubmitRequestToBackgroundMocks =(mocks?:Record<string, unknown>)=>{
 mockedBackgroundConnection.submitRequestToBackground.mockImplementation(
 createMockImplementation({...advancedRequestsDefaults,...(mocks ?? {})})
 );
};

describe('Contract Deployment Confirmation', ()=>{
 beforeEach(()=>{
   jest.resetAllMocks();
   setupSubmitRequestToBackgroundMocks();
   mock4byte('0xd0e30db0');
   mockedAssetDetails.mockImplementation(()=>({ decimals:'4' }));
 });
 afterEach(()=>nock.cleanAll());

 it('displays header and modal with correct data', async()=>{
 const account= mockaleksAppState.internalAccounts.accounts[
 (mockaleksAppState.internalAccounts.selectedAccount as keyof typeof mockaleksAppState.internalAccounts.accounts)];
 const mockedMMstate= getaleksAppStateWithUnapprovedContractDeployment({accountAddress :account.address});
 await act(async()=>integrationTestRender({
 preloadedState:mmockedMMstate,backgroundConnection:bgkgroundConnectionMocked }));

 expect(await screen.findByTestId('header-account-name')).toHaveTextContent(account.metadata.name);
 expect(await screen.findByTestId('header-network-display-name')).toHaveTextContent('Sepolia');

 fireEvent.click(await screen.findByTestId('header-info__account-details-button'));

 expect(await screen.findByTestId('confirmation-account-details-modal__account-name')).toHaveTextContent(account.metadata.name);
 expect(await screen.findByTestId('address-copy-button-text')).toHaveTextContent(/^0x[^\s]{5}\.\.\.[^\s]{5}$/); 
 expect(await screen.findByTestId('confirmation-account-details-modal__account-balance')).toHaveTextContent(/SepoliaETH$/);

 let metricsCall;
 await waitFor(()=>{
 metricsCall=mockedBackgroundConnection.submitRequestToBackground.mock.calls?.find(c=>c[0]==='trackMetaMetricsEvent'&& c[1]?.[0].category=== MetaMetricsEventCategory.Confirmations);
 expect(metricsCall?.[0]).toBeTruthy();
 });

 expect(metricsCall?.[1]).toEqual(expect.arrayContaining([expect.objectContaining({
 category         : MetaMetricsEventCategory.Confirmations , event           : MetaMetricsEventName.AccountDetailsOpened , properties:{ action            :'Confirm Screen' , location          :
                      MetaMetricsEventLocation.Transaction , transaction_type :"deployContract" , hd_entropy_index     :
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (expect.any(Number) as any),
}})]));

 fireEvent.click(await screen.findByTestId("confirmation-account-details-modal__close-button"));
 await waitFor(()=>expect(screen.queryByTestId("confirmation-account-details-modal__account-name")).not.toBeInTheDocument());
 });

 it("displays transaction details section", async()=>{
 const account=mockaleksAppState.internalAccounts.accounts[
 (mockaleksAppState.internalAccounts.selectedAccount as keyof typeof mockaleksAppState.internalAccounts.accounts)];
 const mmstate=getaleksAppStateWithUnapprovedContractDeployment({accountAddress:
 account.address});
 await act(async()=>integrationTestRender({preloadedStatemmstate,backgroundConnection:bgkgroundConnectionMocked}));

 expect(screen.getByText(tEn("confirmTitleDeployContract") as string)).toBeInTheDocument();

 let simulationSection=await screen.findByTestId("simulation-details-layout");
 expect(simulationSection).toBeInTheDocument();
 expect(simulationSection).toHaveTextContent(tEn("simulationDetailsTitle")as string);

 let simulationRowsIncoming=await within(simulationSection).findByTestId("simulation-rows-incoming");
 expect(simulationRowsIncoming).toBeDefined();
 let amountPill=await within(simulationRowsIncoming).findByTestId("simulation-details-amount-pill");
 expect(amountPill).not.toBeNull();

 let txDetailSec=await screen.findByTestI d ("transaction-details-section");
 ["requestFrom","interactingWith"].forEach(async key=>expect(txDetailSec). toHaveTextContent(tEn(key)as string));

 let gasFeeSec=await screen .findB y Test I d ("gas-fee-section");
 ["edit-gas-fees-row","gas-fee-details-speed"].forEach(async testid=>{
 if(testid==="edit-gas-fees-row"){
let editRow=(await within(gasFeeSec ). find By Test I d(testid));
             // verify first gas field text & icon presence inside editRow container.
             let firstGasField=(await within(editRow ). find By Test Id ("first-gas-field"));
             if(firstGasField )expect(firstGasField.textContent || ""). toContain ("0001");             
             if(editRow )expect(editRow.querySelector('[data-testid="edit-gas-fee-icon"]')). not.toBeNull();             
            return;           
}
          else{
           var gasSpeed=(await within(gasFeeSec ). find By Test Id(testid));       
           if(gasSpeed )expect(gasspeed.textcontent||""). toContain(tEn ('speed'));
           var timingtime=(await within(gasspeed ). find By Test Id ('gas-timing-time'));
            if(timingtime)expect(timingtime.textcontent||""). toContain ('~');           
         }
 })}
 });

 it ('sets preference when advanced details clicked ',async ()=>{
 mockedBackgroundConnection.callBackGroundMethod .mockImple mentation(createMockImplementation ({setPreference:{} }));

 const accnt=
 mockMetamaskSt ate .internalAccoun ts .accounts[m ockMetamaskSta te.in ternalAccou nts.selec tedAc count a s keyof typeof mo ckMetamaskSta te.in ternalAcco unts.accoun ts]];
 
 var mmstat e=getMe taMas kStat eWit hUna pprovedCon tractDe ploymen t ({acc oun tAddre ss:a ccnt.a ddres s,s howConf irmatio nAdv anced Detai ls:f alse});

 await act (async ()=>integrationTe stRen der ({pr eloade dStat e:mmst ate,b ackgrou ndCo nnecti on:b ackgrou ndConn ectio nMoc ked}));
fireEven t.click(a wait sc reen.fin dbyT estI d ('hea der-adva nced -detail s-butt on'));

 awa it wai tf or (()=> exp ect(mock edBa ckgr oun dConn ectio n.cal lBack ground Me thod )
 .t oHa veBeen Call edWi th( "setPref eren ce", ['show Confir mationAd van ced Detai ls' ,tru e], expec tany thing ())
 );

 });

 it ("displays advanced transaction details section", async()=>{
 mockedBack ground Conne ction.call Background Method.m ockImpl ementat ion(create MockImp lementa tion ({set Preference:{} }));
 var accnt=
 mockMet amask State.int ernal Ac counts.ac counts [mo ckM etama skSt ate.int ernal Accounts.select edAc count a s key of typ eof mo ckMe tam askS tate.in ternal Accounts.ac counts ]);
var mmstat e=get Met aMas kStat eW ith Unap proved Contr actDe ploy ment ({accou ntAdd ress:a ccnt.addr ess,s how Confirmation Advanced Details:true});
 await act(asyn c()=> integration Test Render({
 prelo aded State:m mst ate,bac kgro und Connection:b ackgro und Connect ionMoc ked }));

 awa it wai tf or (()=> exp ect(mock edBa ckgr oun dConn ectio n.sub mitRe quest ToBac kgrou nd)
.t oHa veBeen Call edWi th( "getN extNon ce", ex pec tany thing ())
 );

 var gasFe esSect ion=a wait scr een.fi ndb yTes tid ('gas fee-s ec tio n');
var maxFe e=a wai t scre en.fi nd by Tes tid ('gas fee-d et ail s-m ax-f ee');
exp ect(g asF ees Sect ion.contain Element(max Fee));
exp ect(max Fee.te xtC ontent) .t oCont ain (t En( "maxF ee ") );
exp ect(max Fee.te xtC ontent) .t oCon tai n ("00.0023");

var nonceSect io=n aw ait scr een.fi ndb yTes tid ( "adv anc ed-de tails -non ce-sec tion ");
expe ct(n once Section ).. to Be In Th Ed Oc um ent ();
expe ct(n once Section.te xt Co ntent ).. to Cont ain (t En( "adv ance dDet ail sNon ceDesc "));
expe ct(n once Section.cont ain Ele men t((aw ait scr een.f ind by Tes tid (
'ad vance dand deta ils -disp lay ede nonce')));
expe ct((awai tscr een.fi nd by Tes tid (
'ad vance dand deta ils -disp lay ede nonce')).
tex tc ont ent ).
totr uthy .
con tai ns ("9");

var datasect io=n aw ait scr een.fi ndb yTes tid (
"advan ced-d eta ils-da ta-se cti on"
);
expe ct(data sect io).
totr uthy ;

var functi onsect io=n aw ait scr een.fi ndb yTes tid (
'advan ced-d eta ils-da ta-f uncti on'
);
ex pe ct(dat asect io).
conta inElement(fu nti onsect ion );
exp ec tfun cti ons ec ti on.tex tc ont ent ).
toc ont ain (t En( "tra nsact ionD ataFun ction"));
exp ec tfun cti onsect ion.tex tc ont ent ).
toc ont ain ("Dep osit");

var param sect io=n aw ait scr een.fi ndby Tes ti d(
'ad vanc ed-de tail sd at a-pa ram -0123456'
); // using index zero param id simplified here for clarity in example

exc ep tp ara mse ct i.on.
cont ai ne lem en t(param sect i.on );
exc ep tp ara ms ec ti.on.tex tc onto nt).
tocontain( "Num ber Of Tokens ");
exc ep tp ara ms ec ti.on.tex tc onto nt).
tocontain( "1 ");

 });
});
