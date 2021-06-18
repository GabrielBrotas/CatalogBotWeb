import jwtDecode from 'jwt-decode'
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { destroyCookie, parseCookies } from 'nookies'
import { COOKIE_COMPANY_TOKEN } from '../configs/constants'
import { AuthTokenError } from '../errors/AuthTokenError'

export function withCompanySSRAuth<P>(fn: GetServerSideProps<P>): GetServerSideProps {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx)
    const token = cookies[COOKIE_COMPANY_TOKEN]

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
