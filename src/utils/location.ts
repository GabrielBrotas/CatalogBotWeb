import axios from 'axios'

export interface Address {
  street: string
  neighborhood: string
  city: string
  state: string
}

export interface State {
  id: number
  abbr: string
  name: string
}

export interface City {
  id: number
  name: string
}

export async function getAddressByCep(cep: string) {
  return await axios
    .get<Address>(`https://brasilapi.com.br/api/cep/v1/${cep}`)
    .then(({ data }) => data)
}

export async function getBrazilianStates() {
  return await axios
    .get<{ id: number; sigla: string; nome: string }[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados`
    )
    .then(({ data }) => data.map((item) => ({ id: item.id, abbr: item.sigla, name: item.nome })))
}

export async function getBrazilianCitiesByUF(uf: string) {
  return await axios
    .get<{ id: number; nome: string }[]>(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
    )
    .then(({ data }) => data.map((item) => ({ id: item.id, name: item.nome })))
}

export default getAddressByCep
