import { OrderProduct } from '../services/apiFunctions/clients/orders/types'

export function getTotalPriceFromOrderProduct(orderProduct: OrderProduct) {
  const total =
    orderProduct.product.price * orderProduct.amount +
    orderProduct.pickedOptions.reduce(
      (acc, currentOption) =>
        acc +
        currentOption.optionAdditionals.reduce(
          (acc, currentOptionAdditional) =>
            acc + currentOptionAdditional.price * currentOptionAdditional.amount,
          0
        ),
      0
    )

  return total
}
