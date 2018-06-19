// @flow
import { wallet } from 'neon-js'
import { isEmpty } from 'lodash'

import { DEFAULT_WALLET } from './constants'
import { getStorage, setStorage } from './storage'
import { Account } from './schemas'

function getNEP6AddressData (matchesEncryptedWIF: boolean, address: string) {
  if (matchesEncryptedWIF) {
    return { address }
  } else {
    return {}
  }
}

export async function upgradeNEP6AddAddresses (encryptedWIF: string, wif: string) {
  const data = getStorage('userWallet')
  const loggedIntoAccount = new wallet.Account(wif)

  if (data && data.accounts) {
    const accounts = data.accounts.map((account, idx) => ({
      ...account,
      ...getNEP6AddressData(account.key === encryptedWIF, loggedIntoAccount.address)
    }))

    await setStorage('userWallet', { ...data, accounts })
  }
}

const STORAGE_KEY = 'userWallet';

export const getWallet = () => {
 let obj= getStorage(STORAGE_KEY) || DEFAULT_WALLET;
 return obj;
 //return await DEFAULT_WALLET
}

const setWallet = async (wallet: Object) => {
  setStorage(STORAGE_KEY, wallet)
}

const walletHasKey = (wallet: Object, key: string) => {
  return wallet.accounts.some(account => account.key === key)
}

const walletHasLabel = (wallet: Object, label: string) => {
  return wallet.accounts.some(account => account.label === label)
}

export async function updateAccount (accounts: Array<Object>) {
  debugger;
  const wallet = await getWallet()
  const newWallet = { ...wallet, accounts }
  //await setWallet(newWallet)

  return accounts
}

export async function saveAccount (label: string, address: string, key: string) {
  if (isEmpty(label)) {
    throw new Error('A valid name is required.')
  }

  if (isEmpty(address)) {
    throw new Error('A valid address is required.')
  }

  if (isEmpty(key)) {
    throw new Error('A valid key is required.')
  }

  const wallet = await getWallet()

  if (walletHasKey(wallet, key)) {
    throw new Error(`Address '${address}' already exists.`)
  }

  if (walletHasLabel(wallet, label)) {
    throw new Error(`Account '${label}' already exists.`)
  }

  wallet.accounts.push(new Account({ address, label, key }))
  await setWallet(wallet)

  return wallet.accounts
}
