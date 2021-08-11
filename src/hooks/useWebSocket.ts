import { ICompanyFlow } from './../services/apiFunctions/companies/company/types'
import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../configs/constants'
import socketIoClient, { Socket } from 'socket.io-client'
import { useToast } from '../contexts/Modals/Toast'
import { Notification } from '../services/apiFunctions/clients/notifications/types'
import { toBase64 } from '../utils/dataFormat'

type Props = {
  userId: string
  enabled: boolean
}

type EventUpdateOrderStatus = {
  Sender: string
  Receiver: string
  Order?: string
  status: string
  deliveryTime?: string
  clientWhatsapp?: string
}

export type WppConnectionData = {
  name: string
  cellphone: string
  cellphone_model: string
}

export const useWebSockets = ({ userId, enabled }: Props) => {
  const ref = useRef<Socket>()

  const { addToast } = useToast()

  // notifications
  const [newNotification, setNewNotification] = useState<Notification>()
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  // wpp
  const [qrCode, setQrCode] = useState<string>()
  const [wppConnectionData, setWppConnectionData] = useState<WppConnectionData>()
  const [isWppConnected, setIsWppConnected] = useState(false)
  const [wppConnIsLoading, setWppConnIsLoading] = useState(false)

  const eventUpdateOrderStatus = ({
    Receiver,
    Sender,
    status,
    Order,
    deliveryTime,
    clientWhatsapp,
  }: EventUpdateOrderStatus) => {
    ref.current?.emit('updateOrderStatus', {
      ReceiverID: Receiver,
      SenderID: Sender,
      status,
      deliveryTime,
      clientWhatsapp,
      OrderID: Order,
    })

    if (status === 'pending') {
      ref.current?.emit('sendNotification', {
        Receiver,
        Sender,
        Order,
        Text: "Um cliente acabou de solicitar um pedido!'",
        Type: 'order',
        Status: status,
        clientWhatsapp,
      })
      return
    }

    if (status === 'confirmed') {
      ref.current?.emit('sendNotification', {
        Receiver,
        Sender,
        Order,
        Text: 'Parabens, seu pedido foi confirmado pelo fornecedor!',
        Type: 'order',
        Status: status,
        clientWhatsapp,
      })
      return
    }

    if (status === 'received') {
      ref.current?.emit('sendNotification', {
        Receiver,
        Sender,
        Order,
        Text: 'Parabens, seu pedido foi entregue!',
        Type: 'order',
        Status: status,
        clientWhatsapp,
      })
      return
    }

    if (status === 'canceled') {
      ref.current?.emit('sendNotification', {
        Receiver,
        Sender,
        Order,
        Text: 'Oh não, você teve um pedido cancelado :( !',
        Type: 'order',
        Status: status,
        clientWhatsapp,
      })
      return
    }

    if (status === 'sent') {
      ref.current?.emit('sendNotification', {
        Receiver,
        Sender,
        Order,
        Text: 'Seu pedido esta a caminho!',
        Type: 'order',
        Status: status,
        deliveryTime,
        clientWhatsapp,
      })
      return
    }
  }

  const eventLoggedUser = (userId: string) => {
    ref.current?.emit('loggedUser', userId)
  }

  const connectToWhatsApp = () => {
    if (isSocketConnected && !isWppConnected) {
      console.log('connecting whatsapp..')
      setIsWppConnected(false)
      setWppConnIsLoading(true)
      ref.current?.emit('connectWhatsapp', { userId })
    }
  }

  const disconnectWhatsApp = () => {
    console.log('disconnecting whatsapp..')
    ref.current?.emit('disconnectWhatsapp', { userId })
  }

  useEffect(() => {
    if (!enabled) {
      return
    }

    const socket = socketIoClient(API_URL)

    socket.on('connect', () => {
      eventLoggedUser(userId)
      setWppConnIsLoading(false)
      setIsSocketConnected(true)
    })

    socket.on('reconnect', () => {
      console.log('reconnected')
      setIsSocketConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('socket disconnected')
      setIsSocketConnected(false)
    })

    socket.on('updatedOrderStatus', (data) => {
      const { status, deliveryTime } = data

      if (status === 'pending') {
        addToast({
          title: 'Um cliente acabou de solicitar um pedido!',
          description: 'Abra suas ordens para verificar os dados do pedido',
          status: 'info',
        })
        return
      }

      if (status === 'confirmed') {
        addToast({
          title: 'Parabens, seu pedido foi confirmado pelo fornecedor!',
          status: 'success',
        })
        return
      }

      if (status === 'received') {
        addToast({
          title: 'Parabens, seu pedido foi entregue!',
          status: 'success',
        })
        return
      }

      if (status === 'canceled') {
        addToast({
          title: 'Oh não, você teve um pedido cancelado :( !',
          status: 'info',
        })
        return
      }

      if (status === 'sent') {
        addToast({
          title: 'Seu pedido saiu para entrega!',
          description: deliveryTime && `Tempo previsto de ${deliveryTime}`,
          status: 'info',
        })
        return
      }
    })

    socket.on('newNotification', (data) => {
      setNewNotification(data)
    })

    socket.on('qr', (data) => {
      console.log('wpp -> qr')
      setWppConnIsLoading(false)
      setIsWppConnected(false)
      setQrCode(toBase64(new Uint8Array(data)))
    })

    socket.on('open', (data) => {
      console.log('wpp -> open')
      console.log(data)
      setWppConnectionData({
        name: data.user.name,
        cellphone: String(data.user.jid).split('@')[0],
        cellphone_model: data.user.phone.device_model,
      })
      setWppConnIsLoading(false)
      setIsWppConnected(true)
      setQrCode(null)
    })

    socket.on('close', (data) => {
      console.log('wpp -> close')
      setWppConnIsLoading(false)
      setIsWppConnected(false)
      console.log(data)
      setQrCode(null)
    })

    socket.on('ws-close', (data) => {
      console.log('ws-close')
      setWppConnIsLoading(false)
      setIsWppConnected(false)
      console.log(data)
      setQrCode(null)
    })

    ref.current = socket

    return () => {
      socket.disconnect()
    }
  }, [addToast, enabled, newNotification, userId])

  return {
    eventUpdateOrderStatus,
    eventLoggedUser,
    newNotification,
    setNewNotification,
    connectToWhatsApp,
    wppConnectionData,
    isWppConnected,
    qrCode,
    wppConnIsLoading,
    disconnectWhatsApp,
    isSocketConnected,
  }
}
