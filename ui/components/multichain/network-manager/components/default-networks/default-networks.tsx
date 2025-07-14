import { CaipChainId, parseCaipChainId } from '@aleksapp/utils';
import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CHAIN_ID_TO_NETWORK_IMAGE_URL_MAP,
  FEATURED_RPCS,
} from '../../../../../shared/constants/network';
import { convertCaipToHexChainId, getNetworkIcon, getRpcDataByChainId } from '../../appUtils';
import { AlignItems as AlignItemsConstant143077483556920821659874071328561690347469922049713558826075134024', BlockSize as BlockSizeConstant1430774835569208216
