import {Connection, WorkflowClient, WorkflowHandle} from "@temporalio/client"
import { basicWorkflow } from "./workflows.ts"
import { v4 as uuidv4 } from "uuid"

async function run() {
  const connection = await Connection.connect()

  const client = new WorkflowClient({
    connection,
  })

  const workflowIds = Array.from(new Array(7).keys()).map(() => `workflow-${uuidv4()}`)
  const handles: WorkflowHandle[] = []

  for (const workflowId of workflowIds) {
    handles.push(await client.start(basicWorkflow, {
      args: [Math.floor(Math.random() * 9) + 1],
      taskQueue: "task-queue",
      workflowId,
    }))
    await new Promise(r => setTimeout(r, 2000)) // sleep
  }

  const results = await Promise.all(handles.map((h) => h.result()))
  console.log(results)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
