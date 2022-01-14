import * as React from 'react'
import { ethers } from 'ethers'
import './App.css'

export default function App () {
  const wave = () => {
    alert("Wallet connected and you've waved 👋")
  }

  return (
    <div className='mainContainer'>
      <div className='dataContainer'>
        <div className='header'>👋 Hey there!</div>

        <div className='bio'>
          I am Thekodezilla and I'm trying to transition from web2 to web3 cool?
          Connect your Ethereum wallet and wave at me!
        </div>

        <button className='waveButton' onClick={wave}>
          Connect your wallet to Wave at Me 😉
        </button>
      </div>
    </div>
  )
}
