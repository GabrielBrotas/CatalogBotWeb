import React from 'react';
import { ProductsContainer } from '../../containers/Products/List';
import { withSSRAuth } from '../../utils/withSSRAuth';

export default function Products() {
  return <ProductsContainer />;
}

export const getServerSideProps = withSSRAuth(async ctx => {

  

  return {
    props: {},
  };
});
