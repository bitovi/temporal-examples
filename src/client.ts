import { Connection, WorkflowClient } from "@temporalio/client"
import { placeOrder, orderReadySignal, orderDeliveredSignal } from "./workflows"
import { v4 as uuidv4 } from "uuid"

async function getClient() {
  const connection = await Connection.connect()

  const client = new WorkflowClient({
    connection,
  })

  return client
}

async function order() {
  const client = await getClient()

  await client.start(placeOrder, {
    args: [
      '123',
      '4111111111111111'
    ],
    taskQueue: "task-queue",
    workflowId: '123'
  })
}

async function ready() {
  const client = await getClient()
  const handle = client.getHandle('123')
  await handle.signal(orderReadySignal)
}

async function delivered() {
  const client = await getClient()
  const handle = client.getHandle('123')
  await handle.signal(orderDeliveredSignal)
}

async function run() {
  const arg = process.argv[2]

  switch(arg) {
    case 'order':
      await order()
      break
    case 'ready':
      await ready()
      break
    case 'delivered':
      await delivered()
      break
    default:
      throw new Error(`case ${arg} unknown`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
