import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'

import { CatalogContainer } from '../../../containers/Catalog'
import { useProductModal } from '../../../contexts/Modals/ProductModal'
import { getCategories } from '../../../services/apiFunctions/companies/categories'
import { getCompany } from '../../../services/apiFunctions/companies/company'
import { Company } from '../../../services/apiFunctions/companies/company/types'
import { getProducts } from '../../../services/apiFunctions/companies/products'
import { Product } from '../../../services/apiFunctions/companies/products/types'
import { ProductModal } from '../../../components/Modals/ProductModal'
import { Section } from '../../../components/Section'
import { FloatCart } from '../../../components/Modals/Cart/Float'
import { CartModal } from '../../../components/Modals/Cart/CartReview'
import { RegisterOrLoginClient } from '../../../components/Modals/RegisterOrLoginClient'
import { OrderModal } from '../../../components/Modals/Orders'
import { AlertDialog } from '../../../components/Modals/AlertDialog'

export interface CatalogProps {
  company: Company
  productsAgrupedByCategory: Array<{
    category: string
    products: Product[]
  }>
}

export default function Catalog({ company, productsAgrupedByCategory }: CatalogProps) {
  const { isProductModalOpen } = useProductModal()

  return (
    <Section>
      <CatalogContainer company={company} productsAgrupedByCategory={productsAgrupedByCategory} />

      {isProductModalOpen && <ProductModal />}
      <FloatCart />
      <CartModal />
      <RegisterOrLoginClient />
      <OrderModal />
      <AlertDialog />
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
        if (product.category && product.category._id === category._id) {
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
        globalStyles: {
          bg: '#f8fafb',
          color: '#444150',
        },
      },
      revalidate: 60 * 60 * 1, // 1 hora
    }
  } catch (err) {
    console.log({ err })
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
      revalidate: 60 * 60 * 24,
    }
  }
}
