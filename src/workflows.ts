import { proxyActivities } from "@temporalio/workflow"

import type * as activities from "./activities"

const { writeSentence } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
})

export async function basicWorkflow(id: number): Promise<string> {
  return writeSentence(id)
}
