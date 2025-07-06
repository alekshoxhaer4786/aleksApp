import { useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ApprovalType } from '@aleksapp/controller-utils';
import { ApprovalRequest } from '@aleksapp/approval-controller';
import { Json } from '@aleksapp/utils';
import {
  CONFIRM_ADD_SUGGESTED_NFT_ROUTE,
  CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE,
  CONFIRM_TRANSACTION_ROUTE,
  CONFIRMATION_V_NEXT_ROUTE,
  CONNECT_ROUTE,
  DECRYPT_MESSAGE_REQUEST_PATH,
  ENCRYPTION_PUBLIC_KEY_REQUEST_PATH,
  SIGNATURE_REQUEST_PATH,
} from '../../../helpers/constants/routes';
import {
  isSignatureTransactionType
} from '../utils';
import {
  getApprovalFlows,
  selectPendingApprovalsForNavigation
} from '../../../selectors';

const CONNECT_APPROVAL_TYPES = [
  ApprovalType.WalletRequestPermissions, 
  'wallet_installSnap', 
  'wallet_updateSnap', 
  'wallet_installSnapResult'
];

export function useConfirmationNavigation() {
  const confirmations = useSelector(selectPendingApprovalsForNavigation, shallowEqual);
  const approvalFlows = useSelector(getApprovalFlows, shallowEqual);
  
  const history = useHistory();

  
    const getIndex = useCallback(
      (confirmationId?: string) => confirmationId ? confirmations.findIndex(({ id }) => id === confirmationId) :0 ,
      [confirmations],
    );

  
    const navigateToId = useCallback(
      (confirmationId?: string) =>
        navigateToConfirmation(confirmationId, confirmations, Boolean(approvalFlows?.length), history),
      [confirmations, approvalFlows?.length, history],
    );

  
    const navigateToIndex = useCallback(
      (index: number) => navigateToId(confirmations[index]?.id),
      [confirmations, navigateToId],
    );

  
    return { confirmations,count:confirmations.length,getIndex,navigateToId,navigateToIndex };
}

export function navigateToConfirmation(
	confirmationId: string | undefined,
	confirmations: ApprovalRequest<Record<string, Json>>[],
	hasApprovalFlows: boolean,
	history: ReturnType<typeof useHistory>,
) {
	const hasNoConfirmations = !confirmations.length || !confirmationId;

	if (hasApprovalFlows && hasNoConfirmations) {
		history.replace(CONFIRMATION_V_NEXT_ROUTE);
		return;
	}

	if (hasNoConfirmations) return;

	const nextConfirmation = confirmations.find(({ id }) => id === confirmationId);

	if (!nextConfirmation) return;

	const type = nextConfirmation.type as ApprovalType;

	if (TEMPLATED_CONFIRMATION_APPROVAL_TYPES.includes(type)) {
		history.replace(`${CONFIRMATION_V_NEXT_ROUTE}/${confirmationId}`);
		return;
	}

	if (isSignatureTransactionType(nextConfirmation)) {
		history.replace(`${CONFIRM_TRANSACTION_ROUTE}/${confirmationId}${SIGNATURE_REQUEST_PATH}`);
		return;
	}

	switch(type){
	  case ApprovalType.Transaction:
		  history.replace(`${CONFIRM_TRANSACTION_ROUTE}/${confirmationId}`);
		  break;
	  case ApprovalType.EthDecrypt:
		  history.replace(`${CONFIRM_TRANSACTION_ROUTE}/${confirmationId}${DECRYPT_MESSAGE_REQUEST_PATH}`);
		  break;
	  case ApprovalType.EthGetEncryptionPublicKey:
		  history.replace(`${CONFIRM_TRANSACTION_ROUTE}/${confirmationId}${ENCRYPTION_PUBLIC_KEY_REQUEST_PATH}`);
		  break;
	  default:
	    if(CONNECT_APPROVAL_TYPES.includes(type)){
	      history.replace(`${CONNECT_ROUTE}/${confirmationId}`);
	      return;
	    }
	    
	    if(type === ApprovalType.WatchAsset){
	      const tokenTokenID=(nextConfirmation.requestData?.asset as Record<string,string>)?.tokenID
	        ?true:false

	      	history.replace(tokenTokenID ? CONFIRM_ADD_SUGGESTED_NFT_ROUTE : CONFIRM_ADD_SUGGESTED_TOKEN_ROUTE)
	    }
	  
	  	break;	
	  
	  
	
}
}
