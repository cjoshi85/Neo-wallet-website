// @flow
import React, { Component } from 'react'
import { map } from 'lodash'

import PasswordField from '../../components/PasswordField'
import HomeButtonLink from '../../components/HomeButtonLink'
import Button from '../../components/Button'

import styles from './LoginLocalStorage.scss'
import loginStyles from '../../styles/login.scss'
import { setStorage } from '../../core/storage';

type Props = {
  loginNep2: Function,
  accounts: Object
}

type State = {
  passphrase: string,
  encryptedWIF: string,
}

export default class LoginLocalStorage extends Component<Props, State> {
  state = {
    passphrase: '',
    encryptedWIF: ''
  }

  render () {
    debugger
    const { accounts } = this.props
    const { passphrase, encryptedWIF } = this.state

    return (
      <div id='loginPage' className={loginStyles.loginPage}>
        <div className={loginStyles.title}>Login using a saved wallet:</div>
        <form onSubmit={this.handleSubmit}>
          <select
            className={styles.selectWallet}
            value={encryptedWIF}
            onChange={this.handleChange}
          >
            <option value=''>Select a wallet</option>
            {map(accounts, (account, index) => (
              <option value={account.key} key={`wallet${account.label}`}>{account.label}</option>
            ))}
          </select>
          <div className={loginStyles.loginForm}>
            <PasswordField
              placeholder='Enter your passphrase here'
              value={passphrase}
              onChange={(e) => this.setState({ passphrase: e.target.value })}
              autoFocus
            />
          </div>
          <div>
            <Button type='submit' disabled={!this.isValid()}>Login</Button>
            <HomeButtonLink />
          </div>
        </form>
      </div>
    )
  }
handleChange=(e)=>{
  debugger
  let vale=null;
  this.setState({ encryptedWIF: e.target.value })
  for(var i=0;i<e.target.length;i++){
    if(e.target[i].value===e.target.value){
      vale=e.target[i].label
      break;
    }
  }
  setStorage('CurrentLogin',vale);
  
}
  handleSubmit = (event: Object) => {
    const { loginNep2 } = this.props
    const { passphrase, encryptedWIF } = this.state
    //this.currentUser();
    event.preventDefault()
    loginNep2(passphrase, encryptedWIF)
  }

  // currentUser = () => {
  //   setStorage()
  // }

  isValid = () => {
    return this.state.encryptedWIF !== '' && this.state.passphrase !== ''
  }
}
