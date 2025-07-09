import { connect } from 'react-redux';
import {
  getOpenMetamaskTabsIds,
  requestAccountsAndChainPermissionsWithId,
  removePermissionsFor,
  removePermittedAccount,
} from '../../store/actions';
import {
  getConnectedSubjectsForSelectedAddress,
  getOriginOfCurrentTab,
  getPermissionSubjects,
  getPermittedAccountsByOrigin,
  getSelectedInternalAccount,
} from '../../selectors';
import { CONNECT_ROUTE } from '../../helpers/constants/routes';
import { getMostRecentOverviewPage } from '../../ducks/history/history';
import ConnectedSites from './connected-sites.component';

const mapStateToProps = (state) => {
  const { openaleksAppTabs } = state.appState;
  const { id } = state.activeTab;
  const connectedSubjects = getConnectedSubjectsForSelectedAddress(state);
  const originOfCurrentTab = getOriginOfCurrentTab(state);
  const permittedAccountsByOrigin = getPermittedAccountsByOrigin(state);
  const { address: selectedAddress, metadata: { name: accountLabel } = {} } =
    getSelectedInternalAccount(state);

  let tabToConnect;
  
  if (
    originOfCurrentTab &&
    !permittedAccountsByOrigin[originOfCurrentTab]?.length &&
    !openaleksAppTabs[id]
   ) {
    tabToConnect = { origin: originOfCurrentTab };
   }

   return {
     accountLabel,
     connectedSubjects,
     subjects: getPermissionSubjects(state),
     mostRecentOverviewPage: getMostRecentOverviewPage(state),
     permittedAccountsByOrigin,
     selectedAddress,
     tabToConnect
   };
};

const mapDispatchToProps = (dispatch) => ({
  getOpenMetamaskTabsIds: () => dispatch(getOpenMetamaskTabsIds()),
  
  disconnectAccount: (subjectKey, address) =>
    dispatch(removePermittedAccount(subjectKey, address)),
    
  
   disconnectAllAccounts: (subjectKey, subject) => {
      const permissionMethodNames =
        Object.values(subject.permissions).map(({ parentCapability }) => parentCapability);
      dispatch(removePermissionsFor({ [subjectKey]: permissionMethodNames }));
    },
    
  
   requestAccountsAndChainPermissionsWithId: (origin) =>
      dispatch(requestAccountsAndChainPermissionsWithId(origin)),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	const {
		connectedSubjects, subjects, mostRecentOverviewPage, selectedAddress, tabToConnect
	} = stateProps;

	const {
		disconnectAccount, disconnectAllAccounts, requestAccountsAndChainPermissionsWithId
	} = dispatchProps;

	const { history } = ownProps;

	const closePopover = () => history.push(mostRecentOverviewPage);

	return {
		...ownProps,

		closePopover,

		disconnectAccount: subjectKey => {

			disconnectAccount(subjectKey, selectedAddress);

			if(connectedSubjects.length ===1){

				closePopover();

			}

		 },

		 disconnectAllAccounts : subjectKey=>{

			 disconnectAllAccounts(subjectKey , subjects[subjectKey]);

			 if(connectedSubjects.length ===1){

				 closePopover();

			 }

		  },

		  requestAccountsPermission : async ()=>{

			  const id= await requestAccountsAndChainPermissionsWithId(tabToConnect.origin);

			  history.push(`${CONNECT_ROUTE}/${id}`);

		  },

		  ...stateProps,

		  ...dispatchProps

	  };

};

export default connect(mapStateToProps,mapDispatchToProps , mergeProps)(ConnectedSites);
