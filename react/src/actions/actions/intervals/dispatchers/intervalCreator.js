import { conditionallyUpdateWallet } from '../../../actionDispatchers'
import { 
  expireData, 
  setExpireTimeoutId, 
  clearExpireTimeoutId, 
  setUpdateExpiredIntervalId, 
  clearUpdateExpiredIntervalId,
  generateUpdateDataAction
} from '../../../actionCreators'
import { ALWAYS_ACTIVATED, NEVER_ACTIVATED } from '../../../../util/constants/componentConstants'
import Store from '../../../../store'
//TODO: If app is ever used in any server side rendering scenario, switch store
//to a function parameter on all of these functions rather than an import

/**
 * Creates the timeout that will expire data from an API call
 * @param {Integer} timeout Time until expiry in ms
 * @param {String} chainTicker Ticker symbol of chain that data is for
 * @param {String} updateId Name of API call
 * @param {Function} onComplete (Optional) Function to execute on timeout completion
 */
export const createExpireTimeout = (timeout, chainTicker, updateId, onComplete) => {
  if (timeout !== ALWAYS_ACTIVATED && timeout !== NEVER_ACTIVATED) {
    const timeoutId = setTimeout(() => {
      Store.dispatch(expireData(chainTicker, updateId))
      //console.log(`${updateId} expired for ${chainTicker}`)
      if (onComplete != null) onComplete(Store.getState(), Store.dispatch, chainTicker) 
    }, timeout);
    //console.log(`${updateId} expire timeout set to ${timeout} with id ${timeoutId}`)
    
    Store.dispatch(setExpireTimeoutId(chainTicker, updateId, timeoutId))
  } else {
    Store.dispatch(clearExpireTimeoutId(chainTicker, updateId))
  }
}

/**
 * Creates the interval that will update expired data through an API call
 * @param {Integer} interval Length of interval in ms
 * @param {String} mode native || electrum || eth
 * @param {String} chainTicker Ticker symbol of chain that data is for
 * @param {String} updateId Name of API call
 * @param {Function} onComplete (Optional) Function to execute on interval completion (every interval)
 */
export const createUpdateExpiredInterval = (interval, mode, chainTicker, updateId, onComplete) => {
  if (interval !== ALWAYS_ACTIVATED && interval !== NEVER_ACTIVATED) {
    //console.log(`${updateId} update expired interval set to ${interval}`)
    const intervalAction = async () => {
      const state = Store.getState()
    
      const updateStatus = await conditionallyUpdateWallet(state, Store.dispatch, mode, chainTicker, updateId)
      //console.log(`Call to ${updateId} for ${chainTicker} in ${mode} mode completed with status: ${updateStatus}`)

      if (onComplete != null) onComplete(state, Store.dispatch, chainTicker) 
    }

    intervalAction()
    const intervalId = setInterval(async () => intervalAction(), interval);
    
    Store.dispatch(setUpdateExpiredIntervalId(chainTicker, updateId, intervalId))
  } else {
    Store.dispatch(clearUpdateExpiredIntervalId(chainTicker, updateId))
  }
}

/**
 * Clears all running api intervals for a chain ticker
 * @param {String} chainTicker Ticker of chain to clear intervals for
 */
export const clearAllCoinIntervals = (chainTicker) => {
  const intervalData = Store.getState().updates.updateIntervals[chainTicker]

  for (let updateType in intervalData) {    
    clearTimeout(intervalData[updateType].expire_id)
    Store.dispatch(clearExpireTimeoutId(chainTicker, updateType))
    clearInterval(intervalData[updateType].update_expired_id)
    Store.dispatch(clearUpdateExpiredIntervalId(chainTicker, updateType))
  }
}

/**
 * Clears old intervals and creates new ones for a certain point in an added
 * coins lifecycle (e.g. post_sync)
 * @param {String} mode native || electrum || eth
 * @param {String} chainTicker Ticker symbol of chain that data is for
 * @param {Function{}} onCompletes Object with optional onCompletes to each updateInterval to be called with state and dispatch function.
 * e.g. {get_info: {update_expired_oncomplete: increaseGetInfoInterval}}
 */
export const refreshIntervals = (mode, chainTicker, onCompletes) => {
  const state = Store.getState()
  const coinObj = state.coins.activatedCoins[chainTicker]
  if (!coinObj) throw new Error(`${chainTicker} is not added for current user. Coins must be added to be used.`)
  const chainStatus = coinObj.status
  
  const updateDataAction = generateUpdateDataAction(mode, chainStatus, chainTicker, coinObj.tags, onCompletes)
  const oldUpdateData = state.updates.updateIntervals[chainTicker]
  const newUpdateData = updateDataAction.updateIntervalData

  if (oldUpdateData) {
    // Clear all previously existing intervals

    for (let updateId in oldUpdateData) {
      clearTimeout(oldUpdateData[updateId].expire_id)
      clearInterval(oldUpdateData[updateId].update_expired_id)
    }
  }

  //Update state
  Store.dispatch(updateDataAction)

  for (let updateId in newUpdateData) {
    createUpdateExpiredInterval(newUpdateData[updateId].update_expired_interval, mode, chainTicker, updateId, newUpdateData[updateId].update_expired_oncomplete)
    createExpireTimeout(newUpdateData[updateId].expire_timeout, chainTicker, updateId, newUpdateData[updateId].expire_oncomplete)
  }
}