import { Connection, WorkflowClient } from "@temporalio/client"
import { sendEmailBatchWorkflow } from "./workflows"
import { v4 as uuidv4 } from "uuid"

async function run() {
  const connection = await Connection.connect()

  const client = new WorkflowClient({
    connection,
  })

  const workflowId = `workflow-${uuidv4()}`
  console.log({ workflowId })

  const handle = await client.start(sendEmailBatchWorkflow, {
    args: [
      workflowId,
      [
        "a123@notarealemailaddress.com",
        "b456@notarealemailaddress.com",
        "c789@notarealemailaddress.com",
      ],
      "Urgent message",
      "We've been trying to contact you about your extended warranty",
    ],
    taskQueue: "task-queue",
    workflowId,
  })

  await handle.result()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
