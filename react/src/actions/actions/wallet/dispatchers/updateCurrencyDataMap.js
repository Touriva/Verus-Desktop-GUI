import { NATIVE } from '../../../../util/constants/componentConstants'
import { SET_COIN_CURRENCY_DATA_MAP, ERROR_COIN_CURRENCY_DATA_MAP } from '../../../../util/constants/storeType'
import { getCurrencyDataMap } from '../../../../util/api/wallet/readCalls/getCurrencyDataMap'
import { getConversionGraph } from '../../../../util/multiverse/multiverseCurrencyUtils'

/**
 * Fetches the appropriate data from the store for a currency data map
 * update and dispatches an update or error action to the store. Returns
 * a boolean indicating whether errors occured or not.
 * @param {Object} state Reference to redux store state
 * @param {Function} dispatch Redux action dispatch function
 * @param {String} mode (native only)
 * @param {String} chainTicker Chain ticker id for chain to fetch currencies for
 * @param {Boolean} currencies Whether or not to include currencies that are no longer active
 */
export const updateCurrencyDataMap = async (state, dispatch, mode, chainTicker) => {
  let dataMapAction = { chainTicker }
  let wasSuccess = true
  let currencies = [chainTicker, ...state.localCurrencyLists.whitelists[chainTicker]]

  if (mode === NATIVE) {
    try {
      const apiResult = await getCurrencyDataMap(mode, chainTicker, currencies)
      if (apiResult.msg === 'success') {
        dataMapAction = {
          ...dataMapAction,
          type: SET_COIN_CURRENCY_DATA_MAP,
          dataMap: apiResult.result,
          conversionGraph: getConversionGraph(apiResult.result.currencyData),
        };
      } else {
        dataMapAction = {...dataMapAction, type: ERROR_COIN_CURRENCY_DATA_MAP, result: apiResult.result}
        wasSuccess = false
      }
    } catch (e) {
      throw e
    }
  } else {
    throw new Error(`"${mode}" is not a supported chain mode for getting currency data maps, expected native`)
  }

  dispatch(dataMapAction)
  return wasSuccess
}