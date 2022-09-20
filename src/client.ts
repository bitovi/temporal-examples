import { Connection, WorkflowClient } from "@temporalio/client"
import { parentWorkflow } from "./workflows"
import { v4 as uuidv4 } from "uuid"

async function run() {
  const connection = await Connection.connect()

  const client = new WorkflowClient({
    connection,
  })

  const handle = await client.start(parentWorkflow, {
    args: ["workflow1"],
    taskQueue: "parent-workflow-queue",
    workflowId: `workflow-${uuidv4()}`,
  })

  console.log(await handle.result())
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
