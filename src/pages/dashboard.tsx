import React from 'react'
import jwtDecode from 'jwt-decode'
import { DashboardContainer } from '../containers/Dashboard'
import { getMyDataAnalysis } from '../services/apiFunctions/companies/company'
import { getCompanyToken } from '../utils/getToken'
import { withCompanySSRAuth } from '../utils/withSSRAuth'
import { groupDataAnalysisByDate } from '../utils/dataFormat'

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
  return <DashboardContainer dataAnalysis={dataAnalysis} />
}

export const getServerSideProps = withCompanySSRAuth(async (ctx) => {
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
})
