import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  ADD_COIN,
  CHAIN_INFO,
  ID_INFO,
  PBAAS_CHAIN_INFO,
  RECEIVE_COIN,
  SEND_COIN,
  TX_INFO,
  OPERATION_INFO,
  IMMATURE_DETAILS,
  CREATE_IDENTITY
} from '../../util/constants/componentConstants';
import AddCoin from './addCoin/addCoin'
import ChainInfo from './chainInfo/chainInfo'
import IdInfo from './idInfo/idInfo'
import PbaasChainInfo from './pbaasChainInfo/pbaasChainInfo'
import ReceiveCoin from './receiveCoin/receiveCoin'
import SendCoin from './sendCoin/sendCoin'
import CreateIdentity from './createIdentity/createIdentity'
import TxInfo from './txInfo/txInfo'
import OperationInfo from './operationInfo/operationInfo'
import ImmatureDetails from './immatureDetails/immatureDetails';

export const ModalRender = function() {
  const COMPONENT_PROPS = {
    setModalHeader: this.getModalHeader,
    modalPathArray: this.state.modalPath,
    setModalLock: this.getModalLock,
    closeModal: this.closeModal,
  }
  const COMPONENT_MAP = {
    [ADD_COIN]: (
      <AddCoin
        {...COMPONENT_PROPS}
      />
    ),
    [CHAIN_INFO]: (
      <ChainInfo
        {...COMPONENT_PROPS}
      />
    ),
    [ID_INFO]: (
      <IdInfo
        {...COMPONENT_PROPS}
      />
    ),
    [PBAAS_CHAIN_INFO]: (
      <PbaasChainInfo
        {...COMPONENT_PROPS}
      />
    ),
    [RECEIVE_COIN]: (
      <ReceiveCoin
        {...COMPONENT_PROPS}
      />
    ),
    [SEND_COIN]: (
      <SendCoin
        {...COMPONENT_PROPS}
      />
    ),
    [CREATE_IDENTITY]: (
      <CreateIdentity
        {...COMPONENT_PROPS}
      />
    ),
    [TX_INFO]: (
      <TxInfo
        {...COMPONENT_PROPS}
      />
    ),
    [OPERATION_INFO]: (
      <OperationInfo
        {...COMPONENT_PROPS}
      />
    ),
    [IMMATURE_DETAILS]: (
      <ImmatureDetails
        {...COMPONENT_PROPS}
      />
    )
  };

  return (
    <Dialog
      open={this.props.modalPathArray.length > 0}
      onClose={this.closeModal}
      fullWidth={true}
      disableBackdropClick={this.state.modalLock}
      disableEscapeKeyDown={this.state.modalLock}
      maxWidth="md"
      aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {this.state.modalHeader}
      </DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          minHeight: 600
        }}>
        {COMPONENT_MAP[this.state.modalPath[0]]}
      </DialogContent>
    </Dialog>
  );
}


