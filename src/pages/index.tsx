import React from 'react'
import { LoginContainer } from '../containers/Login'
import { withSSRGuest } from '../utils/withSSRGuest'

export default function Login() {
  return <LoginContainer />
}

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  }
})
