import {
  condition,
  proxyActivities,
  startChild,
  defineQuery,
  defineSignal,
  setHandler,
  continueAsNew,
} from "@temporalio/workflow"

import type * as activities from "./activities"

const MAX_CHILD_ITERATIONS = 3

const { sendEmail, sendCompleteSignal, signalWithStartSendEmailWorkflow } =
  proxyActivities<typeof activities>({
    startToCloseTimeout: "1 minute",
  })

export const statusQuery = defineQuery<string>("status")
export const childCompleteSignal = defineSignal<[]>("childComplete")

export const queueSendEmailWorkflowSignal = defineSignal<
  [parentWorkflowId: string, subject: string, body: string]
>("queueSendEmailWorkflow")

export async function sendEmailBatchWorkflow(
  workflowId: string,
  emailAddresses: string[],
  subject: string,
  body: string
): Promise<void> {
  const statusReceiverHandler = await startChild(
    sendEmailBatchStatusReceiverWorkflow,
    {
      workflowId: `${workflowId}-status-receiver`,
      args: [emailAddresses.length],
    }
  )

  for (const emailAddress of emailAddresses) {
    await signalWithStartSendEmailWorkflow(
      workflowId,
      emailAddress,
      subject,
      body
    )
  }

  return await statusReceiverHandler.result()
}

export async function sendEmailBatchStatusReceiverWorkflow(
  total: number
): Promise<void> {
  let complete = 0
  setHandler(childCompleteSignal, () => {
    complete += 1
  })

  setHandler(statusQuery, () => {
    return `${complete} of ${total} complete`
  })

  await condition(() => complete === total)

  return
}

interface PendingEmail {
  parentWorkflowId: string
  subject: string
  body: string
}
export async function sendEmailWorkflow(emailAddress: string) {
  const pendingEmails: PendingEmail[] = []

  setHandler(
    queueSendEmailWorkflowSignal,
    (parentWorkflowId: string, subject: string, body: string) => {
      pendingEmails.push({ parentWorkflowId, subject, body })
    }
  )

  for (let i = 0; i < MAX_CHILD_ITERATIONS; i++) {
    await condition(() => pendingEmails.length > 0)

    while (pendingEmails.length > 0) {
      const pendingEmail = pendingEmails.shift()
      if (pendingEmail) {
        await sendEmail(emailAddress, pendingEmail.subject, pendingEmail.body)
        await sendCompleteSignal(pendingEmail.parentWorkflowId)
      }
    }
  }

  await continueAsNew<typeof sendEmailWorkflow>(emailAddress)
}
