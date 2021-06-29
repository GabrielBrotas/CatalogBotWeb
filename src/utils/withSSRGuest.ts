import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getCompanyToken } from './getToken'

export function withSSRGuest<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const token = getCompanyToken(ctx)

    if (token) {
      return {
        redirect: {
          destination: '/dashboard',
          permanent: false,
        },
      }
    }
    return await fn(ctx)
  }
}
