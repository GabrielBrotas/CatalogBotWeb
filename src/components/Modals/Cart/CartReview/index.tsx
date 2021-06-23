import React, { Fragment, useEffect, useMemo, useState } from 'react'
import {
  VStack,
  Flex,
  Text,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Box,
  Spinner,
} from '@chakra-ui/react'
import * as yup from 'yup'
import { useCart } from '../../../../contexts/Cart'
import { CartProducts } from './CartProducts'
import { PaymentMethod } from './PaymentMethod'
import { AddressForm } from './AddressForm'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Address } from '../../../../services/apiFunctions/clients/client/types'
import { useToast } from '../../../../contexts/Toast'
import { FormButton } from '../../../Form/button'
import { PaymentMethods } from '../../../../services/apiFunctions/clients/orders/types'
import { RiShoppingCart2Line } from 'react-icons/ri'
import { PriceReview } from './PriceReview'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { CartOrderProduct } from '../../../../services/apiFunctions/clients/cart/types'
import { getTotalPriceFromCartOrderProduct } from '../../../../utils/maths'
import { currencyFormat } from '../../../../utils/dataFormat'

interface HandleBuyProductsProps {
  deliveryAddress: Address
  saveAddressAsDefault?: boolean
}

const buyProductsFormSchema = yup.object().shape({
  deliveryAddress: yup.object().shape({
    state: yup.string().required(),
    city: yup.string().required(),
    street: yup.string().required(),
    neighborhood: yup.string().required(),
    number: yup.string().required(),
    cep: yup.string().required(),
  }),
  saveAddressAsDefault: yup.boolean().optional(),
})

export const CartModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(buyProductsFormSchema),
  })

  const { company, cart, isModalOpen, closeCartModal, clearCart, storeOrder } = useCart()
  const { addToast } = useToast()

  const [cartOrderProducts, setCartOrderProducts] = useState<CartOrderProduct[]>()
  const [step, setStep] = useState(1)

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>('money')

  useEffect(() => {
    if (cart) {
      setCartOrderProducts(cart.orderProducts)
    }
  }, [cart])

  const handleBuyProducts: SubmitHandler<HandleBuyProductsProps> = async (data, event) => {
    event.preventDefault()
    const { deliveryAddress, saveAddressAsDefault = true } = data

    try {
      console.log(data)
      // await storeOrder({ deliveryAddress, paymentMethod, cartOrderProducts })
      // closeCartModal()
      // addToast({
      //   title: 'Ordem registrada com sucesso!',
      //   description: 'Agora basta aguardar o fornecedor confirmar o seu pedido.',
      //   status: 'success',
      // })
    } catch (err) {
      console.log(err)
      addToast({
        title: 'Error',
        description: 'Algo deu errado, tente novamente',
        status: 'error',
      })
    }
  }

  const cartTotalPrice = useMemo(() => {
    if (cartOrderProducts) {
      return currencyFormat(getTotalPriceFromCartOrderProduct(cartOrderProducts))
    }

    return 'R$ 0,00'
  }, [cartOrderProducts])

  const handleClearCart = async () => {
    try {
      await clearCart()
      closeCartModal()
      addToast({
        title: 'Carrinho limpo!',
        status: 'info',
      })
    } catch (err) {
      console.log(err)
      addToast({
        title: 'Error',
        description: 'Algo deu errado, tente novamente',
        status: 'error',
      })
    }
  }

  const handleNextStep = () => {
    setStep(2)
  }

  const handleBackStep = () => {
    setStep(1)
  }

  if (!cart || cart.orderProducts.length === 0) return <></>

  return (
    <Drawer placement="bottom" onClose={closeCartModal} isOpen={isModalOpen}>
      <DrawerOverlay />
      <DrawerContent h="90%" borderTopRadius="2xl">
        <DrawerHeader borderBottomWidth="1px" w="full">
          <Flex alignItems="center" justifyContent="space-between">
            {step === 1 ? (
              <RiShoppingCart2Line size={24} style={{ marginBottom: 2 }} />
            ) : (
              <AiOutlineArrowLeft
                size={24}
                style={{ marginBottom: 2 }}
                onClick={handleBackStep}
                cursor="pointer"
              />
            )}

            <Text ml="2">Carrinho de compras</Text>

            <Text fontWeight="normal" color="gray.600" cursor="pointer" onClick={handleClearCart}>
              Limpar
            </Text>
          </Flex>
        </DrawerHeader>
        <DrawerBody textColor="gray.800">
          <VStack w="full">
            {step === 1 ? (
              <Box w="full">
                {cart ? (
                  <>
                    <CartProducts
                      orderProducts={cartOrderProducts}
                      setCartOrderProducts={setCartOrderProducts}
                    />

                    <Divider />

                    <PriceReview
                      deliveryPrice={'R$ 0,00'}
                      subTotal={cartTotalPrice}
                      totalPrice={cartTotalPrice}
                    />

                    <FormButton secondary w="full" py="6" mt="4" onClick={handleNextStep}>
                      Escolher endereço de entrega
                    </FormButton>
                  </>
                ) : (
                  <Spinner />
                )}
              </Box>
            ) : (
              <form onSubmit={handleSubmit(handleBuyProducts)} style={{ width: '100%' }}>
                <PaymentMethod
                  acceptedPaymentMethods={company.acceptedPaymentMethods}
                  setPaymentMethod={setPaymentMethod}
                  paymentMethod={paymentMethod}
                />

                <Divider />

                <AddressForm register={register} errors={errors} />

                <FormButton secondary w="full" py="6" isSubmitting={isSubmitting} type="submit">
                  Salvar ordem
                </FormButton>
              </form>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
