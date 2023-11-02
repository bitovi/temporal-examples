import { Context } from "@temporalio/activity"

export async function retrieveCart(cartId: number) {
  return {
    products: [
      {
        productId: 5,
        quantity: 2
      }
    ],
    total: 799
  }
}

export async function authorizePayment(creditCardNumber: string, amount: number): Promise<string> {
  const context = Context.current()
  context.sleep(2000)
  return '111'
}

export async function voidPaymentAuthorization(authorizationNumber: string): Promise<void> {
  const context = Context.current()
  context.sleep(2000)
}

export async function sendToStore(): Promise<void> {
  // throw new Error('Store Closed')
  const context = Context.current()
  context.sleep(2000)
}

export async function requestDelivery(): Promise<void> {
  const context = Context.current()
  context.sleep(3000)
}

export async function capturePayment(paymentNumber: string): Promise<void> {
  const context = Context.current()
  context.sleep(1000)
}