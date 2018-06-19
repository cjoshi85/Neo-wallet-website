// @flow
import { connect, type MapStateToProps } from 'react-redux'
import { bindActionCreators } from 'redux'
import { compose } from 'recompose'
import { values, omit, filter, get } from 'lodash'
import { withData, withActions } from 'spunky'
import accountsActions from '../../actions/accountsActions'
import accountActions from '../../actions/accountActions'
import pricesActions from '../../actions/pricesActions'
import balancesActions from '../../actions/balancesActions'
import withNetworkData from '../../hocs/withNetworkData'
import withAuthData from '../../hocs/withAuthData'
import withCurrencyData from '../../hocs/withCurrencyData'
import withFilteredTokensData from '../../hocs/withFilteredTokensData'
import withSuccessNotification from '../../hocs/withSuccessNotification'
import withFailureNotification from '../../hocs/withFailureNotification'
import { updateSettingsActions } from '../../actions/settingsActions'
import { getNetworks } from '../../core/networks'
import { showModal } from '../../modules/modal'
import { participateInSale } from '../../modules/sale'

import WalletInfo from './WalletInfo'

const mapStateToProps: MapStateToProps<*, *, *> = (state: Object) => ({
  networks: getNetworks()
})

const getTokenBalances = (balances: Balances): Array<string> => {
  const tokens = values(omit(balances, 'NEO', 'GAS'))
  return filter(tokens, (token) => token.balance !== '0')
}

const getICOTokenBalances = (balances: Balances): Array<string> => {
  return values(omit(balances, 'NEO', 'GAS'))
}

const mapBalanceDataToProps = (balances: ?Balances): {
  NEO: ?string,
  GAS: ?string,
  tokenBalances: Array<string>,
  icoTokenBalances: Array<string>
} => ({
  NEO: get(balances, 'NEO', null),
  GAS: get(balances, 'GAS', null),
  tokenBalances: balances ? getTokenBalances(balances) : [],
  icoTokenBalances: balances ? getICOTokenBalances(balances) : []
})

const mapPricesDataToProps = (prices: ?Prices): {
  neoPrice: ?number,
  gasPrice: ?number
} => ({
  neoPrice: get(prices, 'NEO'),
  gasPrice: get(prices, 'GAS')
})

const actionCreators = {
  showModal,
  participateInSale
}

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch)

const mapSettingsActionsToProps = (actions) => ({
  setUserGeneratedTokens: (tokens) => actions.call({ tokens })
})
const getAddress = ()=>{
  let CurrentLogin = JSON.parse(localStorage.getItem('CurrentLogin'));
  let accounts = props.accounts.filter(x => x.label === CurrentLogin);
  return accounts[0].address;
}
const mapAccountActionsToProps = (actions, props) => ({
  loadWalletData: () => {
    debugger
   cosole.log(getAddress())
    actions.call({ net: props.net, address: props.address, tokens: props.tokens })
  }
})
const mapAccountsDataToProps = (accounts) => ({ accounts: accounts })
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withData(accountsActions, mapAccountsDataToProps),
  withData(pricesActions, mapPricesDataToProps),
  withData(balancesActions, mapBalanceDataToProps),
  withNetworkData(),
  withAuthData(),
  withCurrencyData('currencyCode'),
  withFilteredTokensData(),
  withActions(updateSettingsActions, mapSettingsActionsToProps),
  withActions(accountActions, mapAccountActionsToProps),
  withSuccessNotification(accountActions, 'Received latest blockchain information.'),
  withFailureNotification(accountActions, 'Failed to retrieve blockchain information.')
)(WalletInfo)
