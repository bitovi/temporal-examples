import { proxyActivities, defineSignal, setHandler, condition } from '@temporalio/workflow'
import type * as activities from './activities'

const {
  retrieveCart, authorizePayment, sendToStore, requestDelivery, capturePayment
} = proxyActivities<typeof activities>({
    startToCloseTimeout: '1 minute'
})

enum OrderState { Placed, Authorized, Ready, Delivered, Complete }

export const orderReadySignal = defineSignal('Ready')
export const orderDeliveredSignal = defineSignal('Delivered')

export async function placeOrder(cartId, creditCardNumber): Promise<void> {
  let status = OrderState.Placed

  setHandler(orderReadySignal, () => { status = OrderState.Ready })
  setHandler(orderDeliveredSignal, () => { status = OrderState.Delivered })

  const cart = await retrieveCart(cartId)

  const paymentAuth = await authorizePayment(creditCardNumber, cart.total)

  await sendToStore()

  await condition(() => status === OrderState.Ready)

  await requestDelivery()

  await condition(() => status === OrderState.Delivered)

  await capturePayment(paymentAuth)
}
