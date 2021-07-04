import dayjs from 'dayjs'
import { StoreCartOrderProductDTO } from './../services/apiFunctions/clients/cart/types'
import { OptionAdditional, Product } from './../services/apiFunctions/companies/products/types'
import { OrderFormated } from '../pages/orders/[oId]'
import { IOrderToUpdateDTO } from '../services/apiFunctions/companies/orders/types'
import { ProductOption } from '../services/apiFunctions/companies/products/types'
import { DataAnalysis } from '../services/apiFunctions/companies/company/types'

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

export const ORDER_STATUS_COLOR_SECONDARY = {
  pending: 'yellow.500',
  confimed: 'green.500',
  sent: 'blue.500',
  received: 'blue.500',
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

interface FormatItemToOrderProductProps {
  activeProduct: Product
  selectedOptions: {
    selectedAdditionalOptions: {
      _id: string
      name: string
      price: number
      amount: number
    }[]
    _id?: string
    name: string
    isRequired: boolean
    maxQuantity: number
    minQuantity: number
    additionals: OptionAdditional[]
  }[]
  comment?: string
}

export function formatItemToAddInCart({
  activeProduct,
  selectedOptions,
  comment,
}: FormatItemToOrderProductProps): StoreCartOrderProductDTO {
  return {
    product: activeProduct._id,
    amount: 1,
    pickedOptions: selectedOptions.map((option) => ({
      productOptionName: option.name,
      optionAdditionals: option.selectedAdditionalOptions.filter(
        (selectedAdditionalOption) => selectedAdditionalOption.amount !== 0
      ),
    })),
    comment,
  }
}

export function currencyFormat(price: number) {
  const formatterPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return formatterPrice.format(price)
}

type GroupDataAnalysisByDate = {
  data: DataAnalysis[]
  type: 'order' | 'view'
}

export function groupDataAnalysisByDate({ data, type }: GroupDataAnalysisByDate): {
  datas: Array<number>
  dates: Array<string>
} {
  const groups = data.reduce((groups, view) => {
    const date = String(view.created_at).split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }

    if (type === 'view') {
      groups[date].push(view.client)
    } else if (type === 'order') {
      groups[date].push(view.order)
    }
    return groups
  }, {})

  const groupArrays = []

  Object.keys(groups).map((date, index) => {
    groupArrays.push({
      date: date,
      data: groups[date],
    })

    // fill empty datas
    if (index !== Object.keys(groups).length - 1) {
      const groupDate = dayjs(date)
      const nextGroupDate = dayjs(Object.keys(groups)[index + 1])

      if (!nextGroupDate.isSame(groupDate.add(1, 'days'))) {
        let dayToAdd = 1
        do {
          groupArrays.push({
            date: groupDate.add(dayToAdd, 'days').toISOString().split('T')[0],
            data: [],
          })
          dayToAdd = dayToAdd + 1
        } while (!nextGroupDate.isSame(groupDate.add(dayToAdd, 'days')))
      }
    }
  })

  return {
    dates: groupArrays.map((date) => date.date),
    datas: groupArrays.map((date) => date.data.length),
  }
}

export function toBase64(arr: Uint8Array) {
  return btoa(arr.reduce((data, byte) => data + String.fromCharCode(byte), ''))
}
