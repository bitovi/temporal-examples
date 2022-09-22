import {
  proxyActivities,
  ChildWorkflowHandle,
  startChild,
  defineQuery,
  defineSignal,
  setHandler,
} from "@temporalio/workflow"

import type * as activities from "./activities"

const { writeSentence, sendCompleteSignal } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: "1 minute",
})

export const statusQuery = defineQuery<string>("status")
export const childCompleteSignal = defineSignal<[]>("childComplete")

export async function parentWorkflow(
  workflowId: string,
  ids: number[]
): Promise<string[]> {
  const childHandles: ChildWorkflowHandle<typeof childWorkflow>[] = []

  let complete = 0
  setHandler(childCompleteSignal, () => {
    complete += 1
  })
  setHandler(statusQuery, () => {
    return `${complete} of ${ids.length} complete`
  })

  for (const id of ids) {
    const handle = await startChild(childWorkflow, {
      args: [workflowId, id],
    })
    childHandles.push(handle)
  }

  return Promise.all(childHandles.map((childHandle) => childHandle.result()))
}

export async function childWorkflow(parentWorkflowId: string, id: number) {
  const sentence = await writeSentence(parentWorkflowId, id)
  await sendCompleteSignal(parentWorkflowId)
  return sentence
}
