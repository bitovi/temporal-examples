import { WorkflowClient } from "@temporalio/client"
import { statusQuery } from "./workflows"

const workflowId = process.argv[2]

async function run() {
  const client = new WorkflowClient()
  const handle = client.getHandle(workflowId)
  const status = await handle.query(statusQuery)

  console.log(status)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})