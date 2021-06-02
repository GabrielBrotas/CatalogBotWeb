import React from 'react';
import { DashboardContainer } from '../containers/Dashboard';
import { withSSRAuth } from '../utils/withSSRAuth';

export default function Dashboard() {
  return <DashboardContainer />;
}

export const getServerSideProps = withSSRAuth(async ctx => {
  return {
    props: {},
  };
});
