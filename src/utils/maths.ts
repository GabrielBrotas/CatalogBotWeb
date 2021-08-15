import { CartOrderProduct } from './../services/apiFunctions/clients/cart/types'
import { OrderProduct } from '../services/apiFunctions/clients/orders/types'

export function getTotalPriceFromOrderProduct(orderProduct: OrderProduct) {
  const ProductPickedOptionsTotalPrice = orderProduct.pickedOptions.reduce(
    (acc, currentPickedOption) =>
      acc +
      currentPickedOption.optionAdditionals.reduce(
        (acc, currentOptional) =>
          acc + Number(currentOptional.amount) * Number(currentOptional.price),
        0
      ),
    0
  )

  const TotalPrice =
    (Number(orderProduct.product.price) + ProductPickedOptionsTotalPrice) * orderProduct.amount

  return TotalPrice
}

export function getTotalPriceFromCartOrderProduct(cartOrderProducts: CartOrderProduct[]) {
  let total = 0

  cartOrderProducts.map((cartOrderProduct) => {
    total += getTotalPriceFromOrderProduct(cartOrderProduct as OrderProduct)
  })

  return total
}
