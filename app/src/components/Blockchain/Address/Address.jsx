// @flow
import React from 'react'
import classNames from 'classnames'
import styles from './Address.scss'

import { openExplorerAddress } from '../../../core/explorer'

type Props = {
  className?: string,
  networkId: NetworkType,
  explorer: ExplorerType,
  address: string
}

export default class Address extends React.Component<Props> {
  handleClick: Function

  constructor (props: Props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
  }

  render () {
    const { address, className } = this.props

    return (
      <span className={classNames(styles.address, className)} onClick={this.handleClick}>
        { address }
      </span>
    )
  }

  handleClick () {
    const { networkId, explorer, address } = this.props
    openExplorerAddress(networkId, explorer, address)
  }
}
