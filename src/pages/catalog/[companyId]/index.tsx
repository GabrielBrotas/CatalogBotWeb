import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'

import { CatalogContainer } from '../../../containers/Catalog'
import { useCatalogModal } from '../../../contexts/CatalogModal'
import { getCategories } from '../../../services/apiFunctions/categories'
import { getCompany } from '../../../services/apiFunctions/company'
import { Company } from '../../../services/apiFunctions/company/types'
import { getProducts } from '../../../services/apiFunctions/products'
import { Product } from '../../../services/apiFunctions/products/types'
import { ProductModal } from '../../../components/Modals/ProductModal'
import { Section } from '../../../components/Section'

export interface CatalogProps {
  company: Company
  productsAgrupedByCategory: Array<{
    category: string
    products: Product[]
  }>
}

export default function Catalog({ company, productsAgrupedByCategory }: CatalogProps) {
  const { isCatalogModalOpen } = useCatalogModal()

  return (
    <Section>
      <CatalogContainer company={company} productsAgrupedByCategory={productsAgrupedByCategory} />

      {isCatalogModalOpen && <ProductModal />}
    </Section>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    const { companyId } = ctx.params

    const [company, categories, products] = await Promise.all([
      getCompany({ ctx, companyId: String(companyId) }),
      getCategories({ ctx, companyId: String(companyId), limit: 999 }),
      // TODO, infinite scroll
      getProducts({ ctx, companyId: String(companyId), limit: 999 }),
    ])

    const formatterPrice = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

    const productsAgrupedByCategory = []

    categories.results.map((category) => {
      const productsFormated = []
      products.results.map((product) => {
        if (product.category._id === category._id) {
          productsFormated.push({
            ...product,
            priceFormated: formatterPrice.format(product.price),
            options: product.options.map((productOptions) => ({
              ...productOptions,
              additionals: productOptions.additionals.map((productOptionsAdditionals) => ({
                ...productOptionsAdditionals,
                priceFormated: formatterPrice.format(productOptionsAdditionals.price),
              })),
            })),
          })
        }
      })

      if (productsFormated.length > 0) {
        productsAgrupedByCategory.push({
          category: category.name,
          products: productsFormated,
        })
      }
    })

    if (!company) {
      return {
        redirect: {
          destination: '/404',
          permanent: false,
        },
        revalidate: 60 * 60 * 24,
      }
    }

    return {
      props: {
        company,
        productsAgrupedByCategory,
      },
      revalidate: 60 * 60 * 1, // 1 hora
    }
  } catch (err) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
      revalidate: 60 * 60 * 24,
    }
  }
}
