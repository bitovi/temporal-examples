import { Worker } from "@temporalio/worker"
import * as activities from "./activities.ts"

const workflowsPath = new URL('./workflows.ts', import.meta.url).toString().replace('file://','')
async function run() {
  const parentWorker = await Worker.create({
    workflowsPath,
    activities,
    taskQueue: "task-queue",
  })

  await parentWorker.run()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
