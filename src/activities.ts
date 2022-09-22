import { WorkflowClient } from "@temporalio/client"
import {
  childWorkflow,
  queueChildWorkflowSignal,
  childCompleteSignal,
} from "./workflows"
import Sentencer from "sentencer"
import { Context } from "@temporalio/activity"

export async function signalWithStartChildWorkflow(
  parentWorkflowId: string,
  id: number
): Promise<void> {
  const client = new WorkflowClient()

  await client.signalWithStart(childWorkflow, {
    taskQueue: "task-queue",
    workflowId: `child-${id}-workflow`,
    args: [],
    signal: queueChildWorkflowSignal,
    signalArgs: [parentWorkflowId, id],
  })
}

export async function writeSentence(id: number): Promise<string> {
  const context = Context.current()
  await context.sleep(Math.floor(Math.random() * 30000))
  const result = Sentencer.make(
    `${id} {{ adjective }} {{ nouns }} went to the {{ noun }}`
  )
  return result
}

export async function sendCompleteSignal(
  parentWorkflowId: string,
  sentence: string
): Promise<void> {
  const client = new WorkflowClient()
  const handle = client.getHandle(`${parentWorkflowId}-status-receiver`)
  return handle.signal(childCompleteSignal, sentence)
}
