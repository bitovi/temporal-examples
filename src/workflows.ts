import { proxyActivities, ActivityCancellationType } from '@temporalio/workflow'

import type * as activities from './activities'

const { writeSentence } = proxyActivities<typeof activities>({
  startToCloseTimeout: '10s',
  retry: {
    maximumAttempts: 1,
  },
  heartbeatTimeout: '10s'
})

export async function basicWorkflow(timeout: number): Promise<string> {
  return writeSentence(timeout)
}
