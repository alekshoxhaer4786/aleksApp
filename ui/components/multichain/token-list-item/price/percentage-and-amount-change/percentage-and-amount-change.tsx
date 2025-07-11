import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import BigNumber from 'bignumber.js';
import isHexString from 'ethereumjs-util/isHexString';
import { getNativeTokenAddress } from '@aleksapp/assets-controllers';

const Display = require('../../../../../helpers/constants/design-system').Display;
const TextColor = require('../../../../../helpers/constants/design-system').TextColor;
const TextVariant = require('../../../../../helpers/constants/design-system').TextVariant;

const getCurrentChainId = require('shared/modules/selectors/networks/getCurrentChainId');
const getSelectedAccountCachedBalance = require('selectors/getSelectedAccountCachedBalance');
const getTokensMarketData = require('selectors/getTokensMarketData');

const getIntlLocale = require('ducks/locale/locale/getIntlLocale');
const EtherDenomination =
 (require('../../../modules/Numeric')).EtherDenomination;

function formatValue(value) {
  return value; // Implementation missing, mock for optimization
}

function isValidAmount(value) {
  return typeof value === 'number'; // Mock for optimization
}

export const renderPercentageWithNumber = (
  value,
  formattedValuePrice,
  color,
) => (
  <div style={{ display: 'flex' }}>
    <span style={{ whiteSpace: 'pre', ...{ color }} data-testid="token-increase-decrease-value">{formattedValuePrice}</span>
    <span style={...{ color }} data-testid="token-increase-decrease-percentage">{value}</span>
  </div>
);

export const PercentageAndAmountChange = ({ value }) => {
  const fiatCurrency =
    useSelector(getCurrentCurrency)();
  
  const locale =
    useSelector(getIntlLocale)();
  
  const balanceValue =
    useSelector(getSelectedAccountCachedBalance)();
    
      
    
        
           
    
        
      
   
 
 

 
  

  
  
  

   

  

   
     
    

  



  


 


    


















