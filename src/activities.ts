import { WorkflowClient } from "@temporalio/client"
import { childCompleteSignal } from "./workflows"

export async function sendEmail(
  emailAddress: string,
  subject: string,
  body: string
): Promise<void> {
  console.log({ emailAddress, subject, body })
}

export async function sendCompleteSignal(
  parentWorkflowId: string
): Promise<void> {
  const client = new WorkflowClient()
  const handle = client.getHandle(parentWorkflowId)
  return handle.signal(childCompleteSignal)
}