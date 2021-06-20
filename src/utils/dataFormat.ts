import { ProductOption } from '../services/apiFunctions/companies/products/types'

export const FORMAT_PAYMENT = {
  boleto: 'Boleto',
  creditCard: 'Cartão de Crédito',
  pix: 'Pix',
  money: 'Dinheiro',
  debit: 'Débito',
}

export const FORMAT_ORDER_STATUS = {
  pending: 'Pendente',
  confimed: 'Confirmado',
  sent: 'Enviado',
  received: 'Recebido',
  canceled: 'Cancelado',
}
export const ORDER_STATUS_COLOR = {
  pending: 'yellow.300',
  confimed: 'green.300',
  sent: 'blue.300',
  received: 'green.300',
  canceled: 'red.500',
}

export function removeIdFromProductOptions(productOptions: ProductOption[]) {
  const optionsFormated = productOptions.map((productOption) => ({
    name: productOption.name,
    isRequired: productOption.isRequired,
    maxQuantity: productOption.maxQuantity,
    minQuantity: productOption.minQuantity,
    additionals: productOption.additionals.map((additional) => ({
      name: additional.name,
      price: additional.price,
    })),
  }))

  return optionsFormated
}
