import { Connection, WorkflowClient } from "@temporalio/client"
import { parentWorkflow } from "./workflows"
import { v4 as uuidv4 } from "uuid"

async function run() {
  const connection = await Connection.connect()

  const client = new WorkflowClient({
    connection,
  })

  const workflowId = `workflow-${uuidv4()}`
  console.log({ workflowId })

  const handle = await client.start(parentWorkflow, {
    args: [workflowId, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
    taskQueue: "parent-workflow-queue",
    workflowId,
  })

  const results = await handle.result()
  console.log(results.join("\n"))
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
