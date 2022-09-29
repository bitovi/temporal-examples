import {
  proxyActivities,
  ChildWorkflowHandle,
  startChild,
  defineQuery,
  defineSignal,
  setHandler,
} from "@temporalio/workflow"

import type * as activities from "./activities"

const { sendEmail, sendCompleteSignal } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: "1 minute",
})

export const statusQuery = defineQuery<string>("status")
export const childCompleteSignal = defineSignal<[]>("childComplete")

export async function sendEmailBatchWorkflow(
  workflowId: string,
  emailAddresses: string[],
  subject: string,
  body: string
): Promise<void[]> {
  const childHandles: ChildWorkflowHandle<typeof sendEmailWorkflow>[] = []

  let complete = 0
  setHandler(childCompleteSignal, () => {
    complete += 1
  })

  setHandler(statusQuery, () => {
    return `${complete} of ${emailAddresses.length} complete`
  })

  for (const emailAddress of emailAddresses) {
    const handle = await startChild(sendEmailWorkflow, {
      args: [workflowId, emailAddress, subject, body],
    })
    childHandles.push(handle)
  }

  return Promise.all(childHandles.map((childHandle) => childHandle.result()))
}

export async function sendEmailWorkflow(
  parentWorkflowId: string,
  emailAddress: string,
  subject: string,
  body: string
): Promise<void> {
  await sendEmail(emailAddress, subject, body)
  return sendCompleteSignal(parentWorkflowId)
}