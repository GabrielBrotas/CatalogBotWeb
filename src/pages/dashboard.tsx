import React from 'react'
import { DashboardContainer } from '../containers/Dashboard'
import { withCompanySSRAuth } from '../utils/withSSRAuth'

export default function Dashboard() {
  return <DashboardContainer />
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  return {
    props: {},
  }
})
