import * as yup from 'yup'
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const removeSpecialCharacters = (s: string) => {
  return s.replace(/[^0-9]/gi, '').trim()
}

export const signUpClientFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().email('Insira um e-mail válido'),
  password: yup.string().required('senha obrigatória'),
  cellphone: yup
    .string()
    .transform(removeSpecialCharacters)
    .length(11, 'Informe o DDD com o número completo')
    .matches(phoneRegExp, 'Insira um número de telefone válido')
    .required('Telefone obrigatório'),
  defaultAddress: yup.object().shape({
    state: yup.string(),
    city: yup.string(),
    street: yup.string(),
    neighborhood: yup.string(),
    number: yup.string(),
    cep: yup.string(),
  }),
})

export const signInClientFormSchema = yup.object().shape({
  user: yup.string().required('Usuario obrigatório'),
  password: yup.string().required('senha obrigatória'),
})
