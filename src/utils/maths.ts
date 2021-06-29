import { CartOrderProduct } from './../services/apiFunctions/clients/cart/types'
import { OrderProduct } from '../services/apiFunctions/clients/orders/types'

export function getTotalPriceFromOrderProduct(orderProduct: OrderProduct) {
  const total =
    Number(orderProduct.product.price) * orderProduct.amount +
    orderProduct.pickedOptions.reduce(
      (acc, currentOption) =>
        acc +
        currentOption.optionAdditionals.reduce(
          (acc, currentOptionAdditional) =>
            acc + Number(currentOptionAdditional.price) * currentOptionAdditional.amount,
          0
        ),
      0
    )

  return total
}

export function getTotalPriceFromCartOrderProduct(cartOrderProducts: CartOrderProduct[]) {
  let total = 0

  cartOrderProducts.map((cartOrderProduct) => {
    total += getTotalPriceFromOrderProduct(cartOrderProduct as OrderProduct)
  })

  return total
}
