import { string, object } from 'yup'
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const removeSpecialCharacters = (s: string) => {
  return s.replace(/[^0-9]/gi, '').trim()
}

export const signUpClientFormSchema = object().shape({
  name: string().required('Nome obrigatório'),
  email: string().email('Insira um e-mail válido'),
  password: string().required('senha obrigatória'),
  cellphone: string()
    .transform(removeSpecialCharacters)
    .length(11, 'Informe o DDD com o número completo')
    .matches(phoneRegExp, 'Insira um número de telefone válido')
    .required('Telefone obrigatório'),
  defaultAddress: object().shape({
    state: string(),
    city: string(),
    street: string(),
    neighborhood: string(),
    number: string(),
    cep: string(),
  }),
})

export const signInClientFormSchema = object().shape({
  user: string().required('Usuario obrigatório'),
  password: string().required('senha obrigatória'),
})
