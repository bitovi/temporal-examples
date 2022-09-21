import { WorkflowClient } from "@temporalio/client"
import { childCompleteSignal } from "./workflows"
import Sentencer from "sentencer"
import { Context } from "@temporalio/activity"

export async function writeToDatabase(
  parentWorkflowId: string,
  id: number
): Promise<string> {
  const context = Context.current()
  await context.sleep(Math.floor(Math.random() * 30000))
  const result = Sentencer.make(
    `${id} {{ adjective }} {{ nouns }} went to the {{ noun }}`
  )

  const client = new WorkflowClient()
  const handle = client.getHandle(parentWorkflowId)
  await handle.signal(childCompleteSignal)

  console.log(result)
  return result
}
