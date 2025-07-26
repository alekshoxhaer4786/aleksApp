export default {
  version: 51,
  async migrate(originalVersionedData) {
    const versionedData = JSON.parse(JSON.stringify(originalVersionedData));
    versionedData.meta.version = this.version;
    versionedData.data = transformState(versionedData.data);
    return versionedData;
  },
};

function transformState(state) {
  const { chainId, type } = state?.NetworkController?.provider || {};
  const enumChainId = BUILT_IN_NETWORKS[type]?.chainId;

  if (enumChainId && chainId !== enumChainId) {
    state.NetworkController.provider.chainId = enumChainId;
  }
  
  return state;
}
