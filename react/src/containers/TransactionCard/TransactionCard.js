import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types';
import { renderAffectedBalance } from '../../util/txUtils/txRenderUtils';
import { setModalParams, setModalNavigationPath } from '../../actions/actionCreators';
import { TX_INFO } from '../../util/constants/componentConstants';
import { TxCardRender } from './TransactionCard.render'

function openTxInfo(props, rowData, dispatch) {
  const { transactions, coin } = props

  dispatch(setModalParams(TX_INFO, { chainTicker: coin, txObj: transactions[rowData.txIndex], displayTx: rowData }))
  dispatch(setModalNavigationPath(TX_INFO))
}

function filterTxs(transactions, searchTerm) {
  let newTransactions = []
  const term = searchTerm.toLowerCase()
  
  // TODO: Make this work for balance types and normal transaction types as they are displayed as well
  transactions.map((tx) => {
    if (searchTerm.length > 0) {
      if (
        (tx.type != null && tx.type.includes(term)) ||
        term.includes(tx.type)
      ) {
        newTransactions.push(tx);
        return;
      }
      if (tx.amount != null && tx.amount.toString().includes(term)) {
        newTransactions.push(tx);
        return;
      }
      if (tx.txid != null && tx.txid.includes(term)) {
        newTransactions.push(tx);
        return;
      }
      if (tx.blockhash != null && tx.blockhash.includes(term)) {
        newTransactions.push(tx);
        return;
      }
      if (
        tx.confirmations != null &&
        tx.confirmations.toString().includes(term)
      ) {
        newTransactions.push(tx);
        return;
      }
      if (
        (tx.address != null && tx.address.toLowerCase().includes(term)) ||
        (tx.displayAddress != null &&
          tx.displayAddress.toLowerCase().includes(term))
      ) {
        newTransactions.push(tx);
        return;
      }
    } else newTransactions.push(tx)
  })
  
  return newTransactions
}

function getDisplayTxs(transactions, props) {
  let transactionsComps = transactions.map((tx, index) => {
    return {
      type: tx.type ? tx.type : tx.category, // "category" is used on native, while "type" is used for electrum & eth/erc20
      amount: Number(tx.amount),
      address: tx.address,
      confirmations: Number(tx.confirmations),
      time: Number(tx.blocktime != null ? tx.blocktime : tx.timestamp),
      affectedBalance: renderAffectedBalance(tx),
      txIndex: index,
      txid: tx.txid,
      blockhash: tx.blockhash,
      displayAddress:
        tx.address != null && props.multiverseNameMap && props.multiverseNameMap[tx.address]
          ? `${props.multiverseNameMap[tx.address]}@ (${tx.address})`
          : tx.address,
    };
  });

  transactionsComps.sort((a, b) => (a.confirmations > b.confirmations) ? 1 : -1)

  return transactionsComps
}

function TransactionCard(props) {
  const [displayTxs, setDisplayTxs] = useState([])
  const [txSearchTerm, setTxSearchTerm] = useState('')
  const { transactions } = props
  const dispatch = useDispatch()
  
  useEffect(() => setDisplayTxs(filterTxs(getDisplayTxs(transactions, props), txSearchTerm)), [transactions])

  return TxCardRender(
    openTxInfo,
    getDisplayTxs,
    filterTxs,
    { displayTxs, setDisplayTxs, txSearchTerm, setTxSearchTerm },
    props,
    dispatch
  );
}

TransactionCard.propTypes = {
  transactions: PropTypes.array.isRequired,
  coin: PropTypes.string.isRequired,
  multiverseNameMap: PropTypes.object
};

export default TransactionCard
