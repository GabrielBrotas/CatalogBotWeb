import React from 'react'
import { AuthCompanySEO } from '../../../components/SEO/auth-company-seo'
import { EditCategoryContainer } from '../../../containers/Categories/Edit'
import { useCompanyAuth } from '../../../contexts/AuthCompany'
import { getCategory } from '../../../services/apiFunctions/companies/categories'
import { Category } from '../../../services/apiFunctions/companies/categories/types'
import { withCompanySSRAuth } from '../../../utils/withSSRAuth'

export interface EditCategoryProps {
  category: Category
}

export default function EditCategory({ category }: EditCategoryProps) {
  const { company } = useCompanyAuth()
  return (
    <>
      {company && <AuthCompanySEO company={company} page="Categorias" />}{' '}
      <EditCategoryContainer category={category} />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const { cId } = ctx.params

    const category = await getCategory({ categoryId: cId as string, ctx })

    return {
      props: {
        category,
      },
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
