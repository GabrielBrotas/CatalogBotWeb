import React from 'react'

import { CreateCategoryContainer } from '../../containers/Categories/Create'
import { withSSRAuth } from '../../utils/withSSRAuth'

export default function CreateCategory() {
  return <CreateCategoryContainer />
}
export const getServerSideProps = withSSRAuth(async (ctx) => {
  try {
    return {
      props: {},
    }
  } catch (err) {
    console.log(err)
    return {
      redirect: {
        destination: '/categories',
        permanent: false,
      },
    }
  }
})
