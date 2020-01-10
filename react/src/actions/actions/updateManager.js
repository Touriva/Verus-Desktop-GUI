import { IS_PBAAS, IS_ZCASH, IS_PBAAS_ROOT } from '../../util/constants/componentConstants'
import { DEFAULT_COIN_UPDATE_PARAMS, DEFAULT_SYSTEM_UPDATE_PARAMS } from '../../util/constants/defaultUpdateParams'
import {
  SET_COIN_UPDATE_DATA,
  EXPIRE_COIN_DATA,
  RENEW_COIN_DATA,
  SET_COIN_EXPIRE_ID,
  SET_COIN_UPDATE_EXPIRED_ID,
  CLEAR_COIN_EXPIRE_ID,
  CLEAR_COIN_UPDATE_EXPIRED_ID,
  FREE_COIN_API_CALL,
  OCCUPY_COIN_API_CALL,
  DISABLE_UPDATE_WARNING_SNACK,
  ENABLE_UPDATE_WARNING_SNACK,
  OCCUPY_SYSTEM_API_CALL,
  FREE_SYSTEM_API_CALL,
  SET_SYSTEM_UPDATE_DATA,
  SET_SYSTEM_UPDATE_INTERVAL_ID,
  CLEAR_SYSTEM_UPDATE_INTERVAL_ID
} from "../../util/constants/storeType";

/**
 * Returns an action to initialize all coin related API call update data
 * @param {String} mode Coin mode ("eth" || "native" || "electrum")
 * @param {String} chainStatus Current chain status in it's lifecycle ("pre_data" || "syncing" || "post_sync")
 * @param {String} chainTicker The ticker for the chain these updates are for
 * @param {String[]} chainTags Tags associated with the chain to be added, e.g. IS_PBAAS
 * @param {Object} onCompletes Object with optional onCompletes to each updateInterval to be called with state and dispatch function.
 * e.g. {get_info: {update_expired_oncomplete: increaseGetInfoInterval}}
 */
export const generateUpdateCoinDataAction = (mode, chainStatus, chainTicker, chainTags, onCompletes = {}) => {
  if (!chainTicker) throw new Error("No chain ticker specified for generateUpdateCoinDataAction")
  
  let updateIntervalData = {}
  let updateTrackingData = {}
  const isPbaasRoot = chainTags.includes(IS_PBAAS_ROOT)
  const isPbaas = chainTags.includes(IS_PBAAS) || isPbaasRoot
  const isZcash = chainTags.includes(IS_ZCASH)
  const updateParams = DEFAULT_COIN_UPDATE_PARAMS(chainTicker)

  for (let key in updateParams[mode]) {
    if (!isPbaas && updateParams[mode][key].restrictions.includes(IS_PBAAS)) continue 
    if (!isZcash && updateParams[mode][key].restrictions.includes(IS_ZCASH)) continue 
    if (!isPbaasRoot && updateParams[mode][key].restrictions.includes(IS_PBAAS_ROOT)) continue 
    if (chainTicker && updateParams[mode][key].restrictions.includes(chainTicker.toUpperCase())) continue 

    updateIntervalData[key] = updateParams[mode][key][chainStatus].interval_info
    updateTrackingData[key] = updateParams[mode][key][chainStatus].tracking_info
    if (onCompletes[key]) updateIntervalData[key] = {...updateIntervalData[key], ...onCompletes[key]}
  }

  return {
    type: SET_COIN_UPDATE_DATA,
    chainTicker,
    updateIntervalData,
    updateTrackingData
  }
}

/**
 * Returns an action to initialize all system related API call update data
 */
export const generateUpdateSystemDataAction = () => {  
  const updateParams = DEFAULT_SYSTEM_UPDATE_PARAMS
  let updateIntervalData = {}
  let updateTrackingData = {}

  for (let key in updateParams) {
    updateIntervalData[key] = updateParams[key].interval_info
    updateTrackingData[key] = updateParams[key].tracking_info
  }

  return {
    type: SET_SYSTEM_UPDATE_DATA,
    updateIntervalData,
    updateTrackingData
  }
}

export const expireData = (chainTicker, dataType) => {
  return {
    type: EXPIRE_COIN_DATA,
    chainTicker,
    dataType
  }
}

export const renewData = (chainTicker, dataType) => {
  return {
    type: RENEW_COIN_DATA,
    chainTicker,
    dataType
  }
}

export const occupyCoinApiCall = (chainTicker, dataType) => {
  return {
    type: OCCUPY_COIN_API_CALL,
    chainTicker,
    dataType
  }
}

export const freeCoinApiCall = (chainTicker, dataType) => {
  return {
    type: FREE_COIN_API_CALL,
    chainTicker,
    dataType
  }
}

export const occupySystemApiCall = (dataType) => {
  return {
    type: OCCUPY_SYSTEM_API_CALL,
    dataType
  }
}

export const freeSystemApiCall = (dataType) => {
  return {
    type: FREE_SYSTEM_API_CALL,
    dataType
  }
}

export const disableUpdateWarningSnack = () => {
  return {
    type: DISABLE_UPDATE_WARNING_SNACK
  }
}

export const enableUpdateWarningSnack = () => {
  return {
    type: ENABLE_UPDATE_WARNING_SNACK
  }
}

export const setExpireTimeoutId = (chainTicker, dataType, timeoutId) => {
  return {
    type: SET_COIN_EXPIRE_ID,
    chainTicker,
    dataType,
    timeoutId
  }
}

export const clearExpireTimeoutId = (chainTicker, dataType) => {
  return {
    type: CLEAR_COIN_EXPIRE_ID,
    chainTicker,
    dataType
  }
}

export const setUpdateExpiredIntervalId = (chainTicker, dataType, intervalId) => {
  return {
    type: SET_COIN_UPDATE_EXPIRED_ID,
    chainTicker,
    dataType,
    intervalId
  }
}

export const clearUpdateExpiredIntervalId = (chainTicker, dataType) => {
  return {
    type: CLEAR_COIN_UPDATE_EXPIRED_ID,
    chainTicker,
    dataType
  }
}

export const setSystemUpdateIntervalId = (dataType, intervalId) => {
  return {
    type: SET_SYSTEM_UPDATE_INTERVAL_ID,
    dataType,
    intervalId
  }
}

export const clearSystemUpdateIntervalId = (dataType) => {
  return {
    type: CLEAR_SYSTEM_UPDATE_INTERVAL_ID,
    dataType
  }
}