import React, { Component } from 'react';
// import { IsEmpty } from 'react-lodash';
import Button from '@material-ui/core/Button';
// import TokenDetails from '../../components/token/token-details';
import Wallet from '../../components/wallet';
import { TRADE_PAGE } from '../../constants/navigation';
import { copyAccountMessage } from '../../../lib/services/static-message-factory-service';
import './styles.css';
import { RENAME } from '../../constants/options';
import { findChainByName } from '../../../lib/constants/chain';
import Governance from '../../images/governance_icon.svg';
import Staking from '../../images/staking_icon.svg';
import ArrowRight from '../../images/arrow_right.svg';
import { getCurrencyIcon } from '../../utils/dashboard';

export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  // eslint-disable-next-line no-unused-vars
  handleAccountMenuOptionsChange = async (option, account, transactionsUrl) => {
    await this.props.configEditAccount(option, account, transactionsUrl);
    if (option.value === RENAME.value) {
      this.textInput.current.focus();
      this.textInput.current.maxLength = 20;
    }
  };

  handleAliasChange = (value, account) => {
    this.props.configAliasAccount(value, account);
  };

  handleAliasInputBlur = account => {
    this.props.renameAlias(account);
  };

  handleOnKeyPress = (e, account) => {
    if (e.key === 'Enter') {
      this.props.renameAlias(account);
    }
  };

  onCopyAddress = () => {
    this.props.createToast({
      message: copyAccountMessage(),
      type: 'info',
    });
  };

  goToTrade = currency => {
    this.props.selectToken(currency);
    this.props.changePage(TRADE_PAGE);
  };

  render() {
    const {
      accounts,
      account,
      balances,
      // transactions,
      balance: { balanceFormatted /**marketData, amount**/ },
      // isLinkToFaucet,
      network,
      // unit,
      accountMenu,
    } = this.props;
    const assetsList = this.props.balance.tokens ? this.props.balance.tokens : null;
    const chain = findChainByName(network.value);
    const theme = chain.icon || 'polkadot';
    return (
      <div>
        <Wallet
          className="wallet-container"
          inputRef={this.textInput}
          accounts={accounts}
          balances={balances}
          balance={balanceFormatted}
          selectedAccount={account}
          theme={theme}
          onAliasChange={this.handleAliasChange}
          onAliasInputBlur={this.handleAliasInputBlur}
          onAliasInputKeyPress={this.handleOnKeyPress}
          onCopyAddress={this.onCopyAddress}
          accountMenu={accountMenu}
          onAccountMenuOptionsChange={this.handleAccountMenuOptionsChange}
        />
        <div className="staking-gov-btn-container">
          <Button variant="contained" className="staking-btn">
            <img
              width="22"
              height="22"
              src={Staking}
              aria-hidden="true"
              alt="staking"
              style={{ marginRight: '10px' }}
            />
            STAKING
          </Button>
          <Button variant="contained" className="governance-btn">
            <img
              width="22"
              height="22"
              src={Governance}
              aria-hidden="true"
              alt="governance"
              style={{ marginRight: '10px' }}
            />
            GOVERNANCE
          </Button>
        </div>
        {/*<IsEmpty*/}
        {/*  value={assetsList}*/}
        {/*  no={() => (*/}
        {/*    <div className="assets-list-wrap">*/}
        {/*      <h3 className="assets-list-title">Assets</h3>*/}
        {/*      {assetsList.map(asset => (*/}
        {/*        <AssetsList assetInfo={asset} goToTrade={this.goToTrade} />*/}
        {/*      ))}*/}
        {/*    </div>*/}
        {/*  )}*/}
        {/*/>*/}
        <div className="assets-list-wrap">
          <h3 className="assets-list-title">Assets</h3>
          {assetsList.map(asset => (
            <AssetsList assetInfo={asset} goToTrade={this.goToTrade} />
          ))}
        </div>
        <div className="dashboard-button-wrap">
          <Button className="assets-btn" style={{ marginRight: '10px' }}>
            DAPPS
          </Button>
          <Button className="assets-btn">ASSETS</Button>
        </div>
      </div>
    );
  }
}

class AssetsList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <div
        className="assets-list-item"
        onClick={() => {
          this.props.goToTrade(this.props.assetInfo.token);
        }}
      >
        <div className="asset-list-left">
          <img src={getCurrencyIcon(this.props.assetInfo.token)} alt="" />
          <span>{this.props.assetInfo.token}</span>
        </div>
        <div className="asset-list-right">
          <span>{this.props.assetInfo.balanceFormatted}</span>
          <img src={ArrowRight} alt="" />
        </div>
      </div>
    );
  }
}
