import { proxyActivities, sleep } from "@temporalio/workflow"
import type * as activities from "./activities.ts"

const { writeSentence } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
})

export async function basicWorkflow(id: number): Promise<string> {
  sleep(5 * 60 * 1000)
  return writeSentence(id)
}
