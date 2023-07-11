import { proxyActivities, sleep } from "@temporalio/workflow"

import type * as activities from "./activities"

const { writeSentence } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
})

export async function basicWorkflow(): Promise<string[]> {
  const sentences: string[] = []

  for (let i=0; i<10; i++) {
    const sentence = await writeSentence()
    sentences.push(sentence)
    console.log({ sentence })
    await sleep('30s')
  }

  return sentences
}
