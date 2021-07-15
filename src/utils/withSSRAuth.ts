import jwtDecode from 'jwt-decode'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { destroyCookie } from 'nookies'
import { COOKIE_COMPANY_TOKEN } from '../configs/constants'
import { AuthTokenError } from '../errors/AuthTokenError'
import { getCompanyToken } from './getToken'

export function withCompanySSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const token = getCompanyToken(ctx)
    // se nao tiver cookie vai redirecionar
    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    const { roles } = jwtDecode(token) as any

    // se nao tiver cookie vai redirecionar
    if (!token && !roles['company']) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    try {
      return await fn(ctx)
    } catch (err) {
      console.log('err here = ', err)
      console.log(err instanceof AuthTokenError)

      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, COOKIE_COMPANY_TOKEN)

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        }
      }
    }
  }
}
