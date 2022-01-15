import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
import abi from './utils/WavePortal.json'

export default function App () {
  const [currentAccount, setCurrentAccount] = useState('')
  const [loading, setLoading] = useState('')
  const [totalWaves, setTotalWaves] = useState(0)

  const checkIfWalletIsConnected = async () => {
    try {
      /*
       * First make sure we have access to window.ethereum
       */
      const { ethereum } = window

      if (!ethereum) {
        alert('Make sure you have metamask!')
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
      } else {
        console.log('No authorized account found')
      }
      console.log('accounts', accounts)
    } catch (error) {
      console.log('error', error)
    }
  }

  /*
   * This runs our function when the page loads.
   */
  useEffect(() => {
    checkIfWalletIsConnected()
    getTotalWaves()
  }, [])
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        alert('Get MetaMask!')
        return
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Connected', accounts[0])
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }
  const contractAddress = '0x7fA9b16072C814b5D62b603607a0dC090445D35C'
  const contractABI = abi.abi
  const wave = async () => {
    try {
      const { ethereum } = window
      setLoading(true)
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        let count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())

        /*
         * Execute the actual wave from your smart contract
         */
        const waveTxn = await wavePortalContract.wave()
        console.log('Mining...', waveTxn.hash)

        await waveTxn.wait()
        console.log('Mined -- ', waveTxn.hash)

        count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())
        setTotalWaves(count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getTotalWaves = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const wavePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )

        let count = await wavePortalContract.getTotalWaves()
        console.log('Retrieved total wave count...', count.toNumber())

        setTotalWaves(count.toNumber())
      } else {
        alert("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    } finally {
    }
  }
  return (
    <div className='mainContainer'>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'wheat',
          backgroundColor: 'blue',
          padding: '5px',
          borderRadius: '3px'
        }}
      >
        Total waves 👋 ({totalWaves})
      </div>
      <div className='dataContainer'>
        <div className='header'>👋 Hey there!</div>

        <div className='bio'>
          I am Thekodezilla and I'm trying to transition from web2 to web3 cool?
          Connect your Ethereum wallet and wave at me!
        </div>
        <button
          className='waveButton'
          style={{ marginBottom: '5px' }}
          onClick={wave}
        >
          Wave at Me 😉
        </button>
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px'
          }}
        >
          {currentAccount ? (
            <p style={{ textAlign: 'center', color: 'chocolate', margin: 0 }}>
              {String(currentAccount)}
            </p>
          ) : (
            <button className='waveButton' onClick={connectWallet}>
              Connect your wallet to Wave at Me 😉
            </button>
          )}
        </div>
      </div>
      {loading && (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: '0px',
            left: '0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgb(98 37 113 / 34%)'
          }}
        >
          <h2 style={{ color: 'white' }}>Loading...</h2>
        </div>
      )}
    </div>
  )
}
