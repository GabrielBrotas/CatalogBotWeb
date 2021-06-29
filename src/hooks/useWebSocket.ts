import { useEffect, useRef, useState } from 'react'
import { API_URL } from '../configs/constants'
import socketIoClient, { Socket } from 'socket.io-client'
import { useToast } from '../contexts/Modals/Toast'
import { Notification } from '../services/apiFunctions/clients/notifications/types'

type Props = {
  userId: string
  enabled: boolean
}

type EventUpdateOrderStatus = {
  Sender: string
  Receiver: string
  Order?: string
  status: string
}

export const useWebSockets = ({ userId, enabled }: Props) => {
  const ref = useRef<Socket>()

  const { addToast } = useToast()
  const [newNotification, setNewNotification] = useState<Notification>()

  const eventUpdateOrderStatus = ({ Receiver, Sender, status, Order }: EventUpdateOrderStatus) => {
    ref.current?.emit('updateOrderStatus', { userID: Receiver, status })

    if (status === 'pending') {
      ref.current?.emit('sendNotification', {
        Receiver,
        Sender,
        Order,
        Text: "Um cliente acabou de solicitar um pedido!'",
        Type: 'order',
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
      })
      return
    }
  }

  const eventLoggedUser = (userId: string) => {
    ref.current?.emit('loggedUser', userId)
  }

  useEffect(() => {
    if (!enabled) {
      return
    }

    const socket = socketIoClient(API_URL)

    socket.on('updatedOrderStatus', (data) => {
      const { status } = data
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
          title: 'Parabens, seu peidido foi entregue!',
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
    })

    socket.on('newNotification', (data) => {
      setNewNotification(data)
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
    })

    socket.on('connect', () => {
      console.log('connected')
      eventLoggedUser(userId)
    })

    socket.on('reconnect', () => {
      console.log('reconnected')
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
  }
}
