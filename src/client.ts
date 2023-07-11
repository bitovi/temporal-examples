import { Connection, WorkflowClient } from "@temporalio/client"
import { basicWorkflow } from "./workflows"
import { v4 as uuidv4 } from "uuid"

async function run() {
  const connection = await Connection.connect()

  const client = new WorkflowClient({
    connection,
  })

  const workflowId = `workflow-${uuidv4()}`

  const handle = await client.start(basicWorkflow, {
    args: [],
    taskQueue: "task-queue-1",
    workflowId,
  })

  const results = await handle.result()
  console.log(results)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
