import React from 'react';
import MiningStyles from './mining.styles'
import { DASHBOARD, MINING_POSTFIX, MS_IDLE, INFO_SNACK, MID_LENGTH_ALERT } from '../../../../util/constants/componentConstants'
import Tooltip from '@material-ui/core/Tooltip';
import { newSnackbar } from '../../../../actions/actionCreators';

export const MiningCardRender = function(coinObj) {
  const {
    balances,
    mainPathArray,
  } = this.props;
  const miningState = this.state.miningStates[coinObj.id] ? this.state.miningStates[coinObj.id] : MS_IDLE

  const isActive = mainPathArray.includes(`${coinObj.id}_${MINING_POSTFIX}`);
  const coinBalance = balances[coinObj.id]
    ? balances[coinObj.id].native.public.confirmed +
      (balances[coinObj.id].native.private.confirmed
        ? balances[coinObj.id].native.private.confirmed
        : 0)
    : "-";

  // TODO: Possibly re-add ability to deactivate coin from here down in newline at bottom of returned component
  return (
    <button
      className="unstyled-button"
      onClick={() => { this.props.dispatch(newSnackbar(INFO_SNACK, `The ${coinObj.name} mining screen is currently in progress and will be available in the near future!`, MID_LENGTH_ALERT))}}
      key={coinObj.id}
      style={MiningStyles.cardClickableContainer}
    >
      <div
        className="d-flex flex-column align-items-end"
        style={MiningStyles.cardContainer}
      >
        <div
          className={`card ${isActive ? "active-card" : "border-on-hover"}`}
          style={MiningStyles.cardInnerContainer}
        >
          <div
            className="card-body d-flex justify-content-between"
            style={MiningStyles.cardBody}
          >
            <div>
              <div
                className="d-flex"
                style={MiningStyles.cardCoinInfoContainer}
              >
                <img
                  src={`assets/images/cryptologo/btc/${coinObj.id.toLowerCase()}.png`}
                  width="25px"
                  height="25px"
                />
                <h4 style={MiningStyles.cardCoinName}>
                  <strong>{coinObj.name}</strong>
                </h4>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <Tooltip title={this.miningStateDescs[miningState]}>
                <img
                  src={`assets/images/icons/status_icons/${miningState}.svg`}
                  width="25px"
                  height="25px"
                />
              </Tooltip>
              <h5 className="text-right" style={MiningStyles.balance}>
                {`${
                  isNaN(coinBalance)
                    ? coinBalance
                    : Number(coinBalance.toFixed(8))
                } ${coinObj.id}`}
              </h5>
            </div>
          </div>
        </div>
        
      </div>
    </button>
  );
}

export const MiningTabsRender = function() {
  return [
    <li className="nav-item" role="presentation" key="wallet-dashboard">
      <a
        className={`nav-link ${this.props.mainPathArray.includes(
          DASHBOARD ? "active" : ""
        )}`}
        href="#"
        onClick={() => this.openDashboard()}
        style={MiningStyles.secondaryTabBarLink}
      >
        <i className="fas fa-home" style={MiningStyles.navigationTabIcon} />
        {"Mining Dashboard"}
      </a>
    </li>,
    <li className="nav-item" role="presentation" key="wallet-addcoin">
      <a
        className="nav-link"
        href={"#"}
        style={MiningStyles.secondaryTabBarLink}
        onClick={this.openAddCoinModal}
      >
        <i className="fas fa-plus" style={MiningStyles.navigationTabIcon} />
        {"Add Coin"}
      </a>
    </li>
  ];
}