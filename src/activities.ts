import { WorkflowClient } from "@temporalio/client"
import {
  sendEmailWorkflow,
  queueSendEmailWorkflowSignal,
  childCompleteSignal,
} from "./workflows"

export async function signalWithStartSendEmailWorkflow(
  parentWorkflowId: string,
  emailAddress: string,
  subject: string,
  body: string
): Promise<void> {
  const client = new WorkflowClient()

  await client.signalWithStart(sendEmailWorkflow, {
    taskQueue: "task-queue",
    workflowId: `${emailAddress}-send-email-workflow`,
    args: [emailAddress],
    signal: queueSendEmailWorkflowSignal,
    signalArgs: [parentWorkflowId, subject, body],
  })
}

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
  const handle = client.getHandle(`${parentWorkflowId}-status-receiver`)
  return handle.signal(childCompleteSignal)
}
