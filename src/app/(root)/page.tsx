import { SignOutButton, UserButton } from '@clerk/nextjs'
import React from 'react'

const Home = () => {
  return (
    <div>
      <p>
        Home
      </p>
      <SignOutButton redirectUrl='/'/>
    </div>
  )
}

export default Home