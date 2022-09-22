import {
  condition,
  proxyActivities,
  startChild,
  defineQuery,
  defineSignal,
  setHandler,
} from "@temporalio/workflow"

import type * as activities from "./activities"

const { writeSentence, signalWithStartChildWorkflow } = proxyActivities<
  typeof activities
>({
  startToCloseTimeout: "1 minute",
})

export const statusQuery = defineQuery<string>("status")
export const childCompleteSignal =
  defineSignal<[sentence: string]>("childComplete")
export const queueChildWorkflowSignal =
  defineSignal<[parentWorkflowId: string, id: number]>("queueChilWorkflow")

export async function parentWorkflow(
  workflowId: string,
  ids: number[]
): Promise<string[]> {
  const statusReceiverHandler = await startChild(parentWorkflowSignalReceiver, {
    workflowId: `${workflowId}-status-receiver`,
    args: [ids.length],
  })

  for (const id of ids) {
    await signalWithStartChildWorkflow(workflowId, id)
  }

  return await statusReceiverHandler.result()
}

export async function parentWorkflowSignalReceiver(
  total: number
): Promise<string[]> {
  const sentences: string[] = []

  setHandler(statusQuery, () => {
    return `${sentences.length} of ${total} complete`
  })

  setHandler(childCompleteSignal, (sentence: string) => {
    console.log(sentence)
    sentences.push(sentence)
  })

  await condition(() => sentences.length === total)

  return sentences
}

interface Sentence {
  parentWorkflowId: string
  id: number
}
export async function childWorkflow() {
  const pendingSentences: Sentence[] = []

  setHandler(
    queueChildWorkflowSignal,
    (parentWorkflowId: string, id: number) => {
      pendingSentences.push({ parentWorkflowId, id })
    }
  )

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await condition(() => pendingSentences.length > 0)

    const sentence = pendingSentences.shift()
    if (sentence) {
      await writeSentence(sentence.parentWorkflowId, sentence.id)
    }
  }
}
