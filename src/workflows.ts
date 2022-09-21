import {
  proxyActivities,
  ChildWorkflowHandle,
  startChild,
} from "@temporalio/workflow"

import type * as activities from "./activities"

const { writeToDatabase } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
})

export async function parentWorkflow(ids: number[]): Promise<string[]> {
  const childHandles: ChildWorkflowHandle<typeof childWorkflow>[] = []

  for (const id of ids) {
    const handle = await startChild(childWorkflow, {
      args: [id],
    })
    childHandles.push(handle)
  }

  return Promise.all(childHandles.map((childHandle) => childHandle.result()))
}

export async function childWorkflow(id: number) {
  return writeToDatabase(id)
}
