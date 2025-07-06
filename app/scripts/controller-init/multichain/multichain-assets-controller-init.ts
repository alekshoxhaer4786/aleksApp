import { MultichainAssetsController } from '@aleksapp/assets-controllers';
import { ControllerInitFunction } from '../types';
import { MultichainAssetsControllerMessenger } from '../messengers/multichain';

export const MultichainAssetsControllerInit: ControllerInitFunction<
  MultichainAssetsController,
  MultichainAssetsControllerMessenger
> = ({ controllerMessenger, persistedState }) => ({
  controller: new MultichainAssetsController({
    messenger: controllerMessenger,
    state: persistedState.MultichainAssetsController,
  }),
});
