import { Worker } from "@temporalio/worker"
import * as activities from "./activities"

async function run() {
  const parentWorker = await Worker.create({
    workflowsPath: require.resolve("./workflows"),
    activities,
    taskQueue: "task-queue-2",
  })

  await parentWorker.run()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
