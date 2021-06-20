import * as yup from 'yup'

export const signUpClientFormSchema = yup.object().shape({
  name: yup.string().required('Nome obrigatório'),
  email: yup.string().email('Insira um e-mail válido'),
  password: yup.string().required('senha obrigatória'),
  cellphone: yup.string().required('Telefone obrigatório'),
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
