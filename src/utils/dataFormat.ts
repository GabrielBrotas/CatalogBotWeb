import { OrderFormated } from '../pages/orders/[oId]'
import { IOrderToUpdateDTO, Order } from '../services/apiFunctions/companies/orders/types'
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
  confimed: 'Confirmada',
  sent: 'Enviada',
  received: 'Recebido',
  canceled: 'Cancelada',
}

export const ORDER_STATUS_COLOR = {
  pending: 'yellow.300',
  confimed: 'green.300',
  sent: 'blue.300',
  received: 'blue.300',
  canceled: 'red.500',
}

export const ORDER_STATUS_TOOLTIP_INFO = {
  pending: 'Confirme o pedido para o cliente saber que está em processamento',
  confimed: 'Envie o pedido para o cliente saber que está a caminho',
  sent: 'Quando entregar o pedido marque como enviado',
  received: '',
  canceled: '',
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

export function tranformOrderFormatedInOrderToUpdate(
  orderFormated: OrderFormated
): IOrderToUpdateDTO {
  return {
    deliveryAddress: orderFormated.deliveryAddress,
    orderProducts: orderFormated.orderProducts.map((orderProduct) => ({
      _id: orderProduct._id,
      amount: orderProduct.amount,
      comment: orderProduct.comment,
      pickedOptions: orderProduct.pickedOptions.map((pickedOption) => ({
        productOptionName: pickedOption.productOptionName,
        optionAdditionals: pickedOption.optionAdditionals.map((optionAdditional) => ({
          _id: optionAdditional._id,
          amount: optionAdditional.amount,
          name: optionAdditional.name,
          price: optionAdditional.price,
        })),
      })),
      product: {
        _id: orderProduct.product._id,
        imageUrl: orderProduct.product.imageUrl,
        name: orderProduct.product.name,
        price: orderProduct.product.price,
      },
    })),
    paymentMethod: orderFormated.paymentMethod,
    status: orderFormated.status,
    totalPrice: orderFormated.totalPrice,
  }
}
