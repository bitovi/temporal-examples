import { WorkflowClient } from "@temporalio/client"
import { childCompleteSignal } from "./workflows"
import Sentencer from "sentencer"
import { Context } from "@temporalio/activity"

export async function writeSentence(
  parentWorkflowId: string,
  id: number
): Promise<string> {
  const context = Context.current()
  await context.sleep(Math.floor(Math.random() * 30000))
  const result = Sentencer.make(
    `${id} {{ adjective }} {{ nouns }} went to the {{ noun }}`
  )

  console.log(result)
  return result
}

export async function sendCompleteSignal(
  parentWorkflowId: string
): Promise<void> {
  const client = new WorkflowClient()
  const handle = client.getHandle(parentWorkflowId)
  return handle.signal(childCompleteSignal)
}
