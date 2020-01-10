import React from "react";
import ReactMinimalPieChart from "react-minimal-pie-chart";
import { MS_OFF, MS_IDLE, MS_MINING_STAKING, MS_MERGE_MINING_STAKING, MS_MERGE_MINING, MS_MINING } from "../../../../../util/constants/componentConstants";
import { secondsToTime } from "../../../../../util/displayUtil/timeUtils";
import { normalizeNum } from "../../../../../util/displayUtil/numberFormat";
import Tooltip from '@material-ui/core/Tooltip';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import IconButton from '@material-ui/core/IconButton';

export const DashboardRender = function() {
  return (
    <div
      className="col-md-8 col-lg-9"
      style={{ padding: 16, overflow: "scroll" }}
    >
      <div className="d-flex" style={{ width: "100%", marginBottom: 16 }}>
        <div style={{ padding: 0, width: "100%" }}>
          <div className="card border rounded-0" style={{ height: "100%" }}>
            <div className="card-body">
              <h6
                className="card-title"
                style={{ fontSize: 14, margin: 0, width: "100%" }}
              >
                {"System Overview"}
              </h6>
              <div style={{ display: "flex", flexWrap: "wrap", marginTop: 10 }}>
                { DashboardRenderSystemData.call(this) }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex" style={{ width: "100%", marginBottom: 16 }}>
        <div style={{ padding: 0, width: "100%" }}>
          <div className="card border rounded-0" style={{ height: "100%" }}>
            <div className="card-body">
              <h6
                className="card-title"
                style={{ fontSize: 14, margin: 0, width: "100%" }}
              >
                {"Mining/Staking Overview"}
              </h6>

              { DashboardRenderMiningCards.call(this) }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardRenderSystemData = function() {
  const { coinsMining, coinsStaking } = this.state
  const { cpuLoad, cpuTemp, sysTime } = this.props
  const numMined = coinsMining, numStaked = coinsStaking

  const displayedSystemData = {
    ["Mining"]: `${numMined} ${numMined == 1 ? 'coin' : 'coins'}`,
    ["Staking"]: `${numStaked} ${numStaked == 1 ? 'coin' : 'coins'}`,
    ["CPU Temp"]: `${cpuTemp.main ? cpuTemp.main : '-'} °C`,
    ["Uptime"]: secondsToTime(sysTime.uptime ? sysTime.uptime : '-'),
    ["CPU Load"]: `${cpuLoad.currentload ? cpuLoad.currentload.toFixed(2) : '-'}%`
  }

  return Object.keys(displayedSystemData).map((dataKey, index) => {
    return (
      <div style={{ padding: 0, flex: 1, minWidth: index < 3 ? "33.3%" : "50%" }}>
        <div className="card border rounded-0" style={{ height: "100%" }}>
          <div className="card-body d-lg-flex flex-row justify-content-between align-items-lg-center">
            <h6
              className="card-title"
              style={{
                fontSize: 14,
                margin: 0,
                width: "max-content"
              }}
            >
              {dataKey}
            </h6>
            <h5
              className="card-title"
              style={{
                margin: 0,
                width: "max-content",
                color: "rgb(0,0,0)"
              }}
            >
              <strong>
                {displayedSystemData[dataKey]}
              </strong>
            </h5>
          </div>
        </div>
      </div>
    );
  });
}

export const DashboardRenderMiningCards = function() {
  const { handleThreadChange, props, state, toggleStaking } = this
  const {
    miningStates,
    miningStateDescs,
    nativeCoins,
    getInfoErrors,
    miningInfoErrors,
    miningInfo,
    balances,
    cpuData
  } = props;
  const { loading } = state

  return (
    <div style={{ display: "flex", flexWrap: "wrap", marginLeft: "-0.516%", marginRight: "-0.516%", marginTop: 10 }}>
      {nativeCoins.map((coinObj, index) => {  
        const chainTicker = coinObj.id
        const miningState = miningStates[chainTicker] ? miningStates[chainTicker] : MS_IDLE
        
        const isStaking = miningState !== MS_IDLE && miningInfo[chainTicker].staking

        const hashPow = normalizeNum(miningInfo[chainTicker] ? miningInfo[chainTicker].localhashps : 0)
        const stakeCns = normalizeNum(balances[chainTicker] ? balances[chainTicker].native.public.confirmed : 0)
        
        const miningError = miningInfoErrors[chainTicker] ? miningInfoErrors[chainTicker].error : null
        const getInfoError = getInfoErrors[chainTicker] ? getInfoErrors[chainTicker].error : null

        const coresArr = Array.apply(null, Array(cpuData.cores ? cpuData.cores : 0));

        const descNumData =
          miningState === MS_MINING_STAKING ||
          miningState === MS_MERGE_MINING_STAKING ? (
            <span>
              {"with "} <span style={{fontWeight: "bold"}}>{`~${hashPow[0]} ${hashPow[2]}H/s`}</span>
              {" and "}
              <span style={{fontWeight: "bold"}}>{`~${stakeCns[0]}${stakeCns[2]} ${coinObj.id}`}</span>
            </span>
          ) : miningState === MS_MERGE_MINING || miningState === MS_MINING ? (
            <span>
              {"with "} <span style={{fontWeight: "bold"}}>{`~${hashPow[0]} ${hashPow[2]}H/s`}</span>
            </span>
          ) : (
            <span>
              {"with "}
              <span style={{fontWeight: "bold"}}>{`~${stakeCns[0]}${stakeCns[2]} ${coinObj.id}`}</span>
            </span>
          );

        const descSentence = (
          <span>
            <span>
              {miningState === MS_IDLE ? (
                "Loading mining state..."
              ) : miningState === MS_OFF ? (
                `Not mining or staking ${coinObj.name}`
              ) : (
                <span style={{fontWeight: "bold"}}>
                  {miningStateDescs[miningState]
                    .toLowerCase()
                    .replace(/^\w/, c => c.toUpperCase())}
                </span>
              )}
            </span>
            { miningState !== MS_IDLE && miningState !== MS_OFF &&
              <React.Fragment>
                {` ${coinObj.name} `} 
                {descNumData}
              </React.Fragment>
            }
          </span>
        );

        return (
          <div
            style={{
              width: "32.3%",
              minWidth: 255,
              margin: "0.516%",
              marginTop: 0,
              marginBottom: "1.032%"
            }}
            key={index}
          >
            <div className="col-lg-12" style={{ padding: 0, height: "100%" }}>
              <div className="card rounded-0" style={{ height: "100%" }}>
                <div
                  className="card-body"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`assets/images/cryptologo/btc/${chainTicker.toLowerCase()}.png`}
                      width="40px"
                      height="40px"
                    />
                    <div style={{ paddingLeft: 10, overflow: "hidden" }}>
                      <h3
                        className="d-lg-flex align-items-lg-center"
                        style={{
                          fontSize: 16,
                          color: "rgb(0,0,0)",
                          fontWeight: "bold",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {coinObj.name}
                      </h3>
                      <h3
                        className="d-lg-flex align-items-lg-center coin-type native"
                        style={{
                          fontSize: 12,
                          width: "max-content",
                          padding: 4,
                          paddingTop: 1,
                          paddingBottom: 1,
                          borderWidth: 1
                        }}
                      >
                        {
                          miningStateDescs[
                            miningStates[chainTicker]
                              ? miningStates[chainTicker]
                              : MS_IDLE
                          ]
                        }
                      </h3>
                    </div>
                  </div>
                  <div style={{ marginBottom: 5, minHeight: 60, display: "flex", alignItems: "center" }} key={index}>
                    {miningError || getInfoError ? (
                      <React.Fragment>
                        <i
                          className="fas fa-exclamation-triangle"
                          style={{
                            marginRight: 6,
                            color: "rgb(236,124,43)",
                            fontSize: 18
                          }}
                        />
                        <span
                          style={{
                            color: "rgb(236,124,43)",
                            fontWeight: "bold"
                          }}
                        >
                          {getInfoError
                            ? getInfoErrors[chainTicker].result
                            : miningInfoErrors[chainTicker].result}
                        </span>
                      </React.Fragment>
                    ) : (
                      <span style={{ fontWeight: 300, color: "black" }}>
                        {descSentence}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      flex: 1
                    }}
                  >
                    <Tooltip
                      title={isStaking ? "Stop Staking" : "Start Staking"}
                    >
                      <span>
                        <IconButton
                          onClick={() => toggleStaking(chainTicker)}
                          disabled={
                            miningState === MS_IDLE || loading[chainTicker]
                          }
                        >
                        
                          {isStaking ? <AttachMoneyIcon /> : <MoneyOffIcon />}
                        </IconButton>
                      </span>
                    </Tooltip>
                    <FormControl variant="outlined">
                      <InputLabel>{"Mining"}</InputLabel>
                      <Select
                        labelWidth={50}
                        style={{ width: 120 }}
                        value={
                          miningState !== MS_IDLE && !loading[chainTicker]
                            ? miningInfo[chainTicker].numthreads
                            : -1
                        }
                        onChange={event =>
                          handleThreadChange(event, chainTicker)
                        }
                        //labelWidth={50}
                        disabled={
                          miningState === MS_IDLE || loading[chainTicker]
                        }
                      >
                        {(miningState === MS_IDLE ||
                          loading[chainTicker]) && (
                          <MenuItem value={-1}>
                            <em>{"Loading..."}</em>
                          </MenuItem>
                        )}
                        <MenuItem value={0}>{"Off"}</MenuItem>
                        {coresArr.map((value, index) => {
                          return (
                            <MenuItem value={index + 1}>{`${index + 1} ${
                              index == 0 ? "thread" : "threads"
                            }`}</MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })} 
    </div>
  )
}