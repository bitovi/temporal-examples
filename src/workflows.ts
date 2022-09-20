import { proxyActivities } from "@temporalio/workflow"

import type * as activities from "./activities"

const { writeToDatabase } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
})

export async function parentWorkflow(name: string): Promise<string> {
  return await writeToDatabase(name)
}
