import React, { Fragment, useState } from 'react'
import {
  VStack,
  Flex,
  Avatar,
  Text,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react'
import * as yup from 'yup'
import { useCart } from '../../../../contexts/Cart'
import { CartProducts } from './Products'
import { PaymentMethod } from './PaymentMethod'
import { AddressForm } from './AddressForm'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Address } from '../../../../services/apiFunctions/clients/client/types'
import { useToast } from '../../../../contexts/Toast'
import { Button } from '../../../Form/button'
import { PaymentMethods } from '../../../../services/apiFunctions/clients/orders/types'

interface HandleBuyProductsProps {
  deliveryAddress: Address
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
})

export const CartModal = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(buyProductsFormSchema),
  })

  const { company, cart, isCartModalOpen, setIsCartModalOpen, clearCart, storeOrder } = useCart()
  const { addToast } = useToast()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethods>('money')

  const handleBuyProducts: SubmitHandler<HandleBuyProductsProps> = async (data, event) => {
    event.preventDefault()
    const { deliveryAddress } = data

    try {
      await storeOrder({ deliveryAddress, paymentMethod })
      setIsCartModalOpen(false)
      addToast({
        title: 'Ordem registrada com sucesso!',
        description: 'Agora basta aguardar o fornecedor confirmar o seu pedido.',
        status: 'success',
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

  const handleClearCart = async () => {
    try {
      await clearCart()
      setIsCartModalOpen(false)
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

  if (!cart || cart.orderProducts.length === 0) return <></>

  return (
    <Drawer placement="bottom" onClose={() => setIsCartModalOpen(false)} isOpen={isCartModalOpen}>
      <DrawerOverlay />
      <DrawerContent h="90%" borderTopRadius="2xl">
        <DrawerHeader borderBottomWidth="1px" w="full" display="flex" justifyContent="center">
          <Flex align="center" justifyContent="space-between">
            <Text>{company.name}</Text>
            <Avatar size="2xl" name={company.name} src={company.mainImageUrl} />
          </Flex>
        </DrawerHeader>
        <DrawerBody textColor="gray.800">
          <VStack>
            <form onSubmit={handleSubmit(handleBuyProducts)} style={{ width: '100%' }}>
              <CartProducts orderProducts={cart.orderProducts} />

              <Divider />

              <PaymentMethod
                acceptedPaymentMethods={company.acceptedPaymentMethods}
                setPaymentMethod={setPaymentMethod}
                paymentMethod={paymentMethod}
              />

              <Divider />

              <AddressForm register={register} errors={errors} />

              <Button isSubmitting={isSubmitting} type="submit">
                Salvar ordem
              </Button>
            </form>
            <Button onClick={handleClearCart}>Limpar carrinho</Button>
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
