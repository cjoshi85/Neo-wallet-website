// @flow
import React, { Component } from 'react'
import QRCode from 'qrcode/lib/browser'
import BaseModal from '../BaseModal'
import styles from './ReceiveModal.scss'
import CopyToClip from '../../CopyToClipboard'
import { Address } from '../../Blockchain'



type Props = {
  address: string,
  hideModal: Function,
  text: string,
  tooltip?: string,
  className?: string,
  style?: Object
}




export default class ReceiveModal extends Component<Props> {
  state = {
    value: '',
  };

  canvas: ?HTMLCanvasElement

  render () {
    const { hideModal, address } = this.props
    return (
      <BaseModal
        onAfterOpen={() => {
          QRCode.toCanvas(this.canvas, address, { version: 5 }, (err) => {
            if (err) console.log(err)
          })
        }}
        title='NEO Wallet Address'
        hideModal={hideModal}
        style={{
          content: {
            width: '480px',
            height: '460px'
          }
        }}
      >
        <div className={styles.textContainer}>
          <div>Your Public NEO Address:</div>
          <div className={styles.address}>
            <Address className={styles.externalLink} address={address} />
            <CopyToClip text={address} tooltip='Copy Public Key' />
          </div>
          <div className={styles.canvas}><canvas ref={(node) => { this.canvas = node }} /></div>
          <div>Only send assets, such as NEO and GAS, and tokens, such as RPX, that are compatible with the NEO Blockchain.</div>
          <div>Sending any other digital asset or token will result in permanent loss.</div>
        </div>
      </BaseModal>
    )
  }
}
