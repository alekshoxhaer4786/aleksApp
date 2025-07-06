import {
  MethodNames,
  PermissionDoesNotExistError,
} from '@aleksapp/permission-controller';
import {
  Caip25CaveatType,
  Caip25EndowmentPermissionName,
} from '@aleksapp/chain-agnostic-permission';
import { flushPromises } from '../../../../test/lib/timer-helpers';
import * as NetworkSelectors from '../../../../shared/modules/selectors/networks';
import { getPermissionBackgroundApiMethods } from './background-api';

jest.mock('../../../../shared/modules/selectors/networks', () => ({
  ...jest.requireActual('../../../../shared/modules/selectors/networks'),
  getNetworkConfigurationsByCaipChainId: jest.fn(),
}));
const MockNetworkSelectors = jest.mocked(NetworkSelectors);

const setupPermissionBackgroundApiMethods = (overrides) =>
  getPermissionBackgroundApiMethods({
    permissionController: {
      getCaveat: jest.fn(),
      updateCaveat: jest.fn(),
      grantPermissions: jest.fn(),
      revokePermission: jest.fn(),
    },
    approvalController: {
      addAndShowApprovalRequest: jest.fn(),
    },
    accountsController: {
      getAccountByAddress: jest.fn(),
      state: { internalAccounts: {} },
    },
    networkController: { state: { networkConfigurationsByChainId: {} } },
    multichainNetworkController: {
      state: { multichainNetworkConfigurationsByChainId:{} },
    },
    ...overrides,
  });

describe('permission background API methods', () => {
  afterEach(() => {
    jest.resetAllMocks();
    MockNetworkSelectors.getNetworkConfigurationsByCaipChainId.mockReturnValue({});
  });

  describe('addPermittedAccount', () => {
    it('gets the CAIP-25 caveat', () => {
      const permissionController = { getCaveat:jest.fn() };
      try{
        setupPermissionBackgroundApiMethods({permissionController}).addPermittedAccount('foo.com','0x1');
      } catch {}
      
      expect(permissionController.getCaveat).toHaveBeenCalledWith(
        'foo.com',
        Caip25EndowmentPermissionName,
        Caip25CaveatType
      );
    });

    it('throws error if no existing CAIP-25 caveat', () => {
      const permissionController = {getCaveat :jest.fn().mockImplementation(() =>{throw new PermissionDoesNotExistError();})};
      
      expect(() =>
        setupPermissionBackgroundApiMethods({permissionController}).addPermittedAccount('foo.com','0x1')
       ).toThrow(new Error(`Cannot add account permissions for origin "foo.com": no permission currently exists for this origin.`));
     });
    
     it('throws error if unexpected getCaveat failure', () =>{
       const permissionController={getCaveat :jest.fn().mockImplementation(()=>{throw new Error ('unexpected getCaveat error');})};
       
       expect(()=>
         setupPermissionBackgroundApiMethods({permissionController}).addPermittedAccount('foo.com','0x1')
       ).toThrow(new Error(`unexpected getCaveat error`));
     });
     
     it('gets account by address passed in',()=>{
       const permissionController={
         getCaveat :jest.fn().mockReturnValue({
           value:{
             requiredScopes:{},
             optionalScopes:{},
             isMultichainOrigin:true
           }
         }),
         updateCaveat :jest.fn()
       };
       
       const accountsController={
         getAccountByAddress :jest.fn(),state:{internalAccounts:{}}
       };
       
       try{
         setupPermissionBackgroundApiMethods({permissionController,accountsController})
           .addPermittedAccount ('foo.com','0x4');
         
       } catch{}
       
       expect(accountsController.getAccountByAddress).toHaveBeenCalledTimes(1);
       expect(accountsController.getAccountByAddress).toHaveBeenCalledWith ('0x4');
     });
     
     it ('calls updatecavet with caip account added and matching scopes added when none exist yet ',()=>{
      
        const permissionContoller={
          getCaveat :jest .fn ().mockReturnValue({
            value:{
              requiredScopes:{
                'eip155':{accounts:[ ]},
              },optionalScopes:{
                'bip122':{
                  accounts:[
                    'bip122...'
                  ]
                }
              },isMultichainOrigin:true
            }
          }),
          update Cave at : jes t.f n (),
        };

        cons t accounts Contro ller ={ 
          ge t Account By Address :
            je s t .fn (). mock Return Value ({
              address:'0x4',
              scopes:['solana']
            }),state:{internalAccounts:{}}
          };

          Mock Network Selectors. ge t Network Configurations By Ca ip Chain Id. mock Return Value (
            {'solana':{},'solana foo ':{},'solana bar ':{}}
          );

          set up Permission Background Api Methods ({ 
            perm ission Controller ,accounts Controller ,
            
          }). add Permitted Account (' foo com ','0 x4');

         
        
  
   e xp ect (permis sion Contro ller.update Cave at). to Have Been Called With (
   ' fo o com ',
   Cai p2 5 Endowmen t Permissio n Nam e ,
   Cai p2 5 Cave a t Typ e ,
   {

required Scopes:
{
'e ip155 ':{'accounts ':[]}
},

optional Scopes:
{

'b ip122 ':{

'ac counts':[

'b ip122...'

]

},

's olan a':{

'ac counts':['s olan a ':'0 x4']

},

's olan a foo': {

'ac counts':['s olan a foo ':'0 x4']

},

's olan a bar' :

{'ac counts':['so lan abar':'00 x4']}

},


is Multicha in Origin:true



}





);
});
it("calls updat ecav eat with ca ipa ccou nt ad ded to exist ing matchi ng permitt ed sc opes",()=>{


const per mission Control ler ={


get C avea t:
je st.f n() .m ock Return Value({

valu e:

{


required Scope s:

{


'e ip15...





"e i p15...





],

],




),

]);

});

});
