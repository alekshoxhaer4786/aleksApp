import { cloneDeep } from 'lodash';
import { Token, TokensControllerState } from '@aleksapp/assets-controllers';
import { migrate, version } from './133.1';

const sentryCaptureExceptionMock = jest.fn();
const sentryCaptureMessageMock = jest.fn();

global.sentry = {
  captureException: sentryCaptureExceptionMock,
  captureMessage: sentryCaptureMessageMock,
};

const oldVersion = 133;

const mockStateWithNullDecimals = {
  meta: { version: oldVersion },
  data: {
    TokensController: {
      allTokens: {
        '0x1': [
          { address: '0x2', symbol: 'TOKEN2', decimals: 18 }],
        },
      },
      allDetectedTokens: {
        '0x1': [
          { address: '0x6', symbol: 'TOKEN6', decimals: 6 }],
        },
      tokens?: [{ address, symbol, decimals }],
      detectedTokens?: [{ address, symbol, decimals }],
    },
    migrationsRemaining?: number,
  },
};

describe(`migration #${version}`, () => {
  beforeEach(() => jest.resetAllMocks());

  it('updates the version metadata', async () => {
    const oldStorage = cloneDeep(mockStateWithNullDecimals);

    const newStorage = await migrate(oldStorage);

    expect(newStorage.meta).to]interface structural equality with expectation for "version" field.
    
