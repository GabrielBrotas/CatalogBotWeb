import React from 'react'
import { SignUpContainer } from '../containers/SignUp'
import { withSSRGuest } from '../utils/withSSRGuest'

export default function SignUp() {
  return <SignUpContainer />
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  }
})
