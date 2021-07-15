import React from 'react'
import jwtDecode from 'jwt-decode'
import { destroyCookie } from 'nookies'

import { getMyDataAnalysis } from '../services/apiFunctions/companies/company'
import { useCompanyAuth } from '../contexts/AuthCompany'
import { getCompanyToken } from '../utils/getToken'
import { withCompanySSRAuth } from '../utils/withSSRAuth'
import { groupDataAnalysisByDate } from '../utils/dataFormat'
import { COOKIE_COMPANY_TOKEN } from '../configs/constants'

import { DashboardContainer } from '../containers/Dashboard'
import { AuthCompanySEO } from '../components/SEO/auth-company-seo'

export interface DashboardProps {
  dataAnalysis: {
    visit: {
      datas: Array<string | null>
      dates: Array<string>
    }
    order: {
      datas: Array<string | null>
      dates: Array<string>
    }
  }
}

export default function Dashboard({ dataAnalysis }: DashboardProps) {
  const { company } = useCompanyAuth()
  return (
    <>
      {company && <AuthCompanySEO company={company} page="Dashboard" />}
      <DashboardContainer dataAnalysis={dataAnalysis} />
    </>
  )
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
  try {
    const token = getCompanyToken(ctx)

    const { sub: companyId } = jwtDecode(token) as any
    const dataAnalysis = await getMyDataAnalysis({ ctx, companyId })

    const visitsData = dataAnalysis.filter((data) => data.type === 'view')
    const orderData = dataAnalysis.filter((data) => data.type === 'order')

    const dataGroup = {
      visit: groupDataAnalysisByDate({ data: visitsData, type: 'view' }),
      order: groupDataAnalysisByDate({ data: orderData, type: 'order' }),
    }

    return {
      props: {
        dataAnalysis: dataGroup,
      },
    }
  } catch (err) {
    console.log('err here 2 = ', err)

    destroyCookie(ctx, COOKIE_COMPANY_TOKEN)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
})
