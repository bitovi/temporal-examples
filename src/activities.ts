import Sentencer from 'sentencer'
import { Context } from '@temporalio/activity'

export async function writeSentence(timeout: number): Promise<any> {
  let heartbeatEnabled = true;

  (async () => {
    while (heartbeatEnabled) {
      console.log('heartbeat')
      await Context.current().sleep(1000)
      Context.current().heartbeat()
    }
  })()

  const canceledPromise = Context.current().cancelled

  const activityPromise = new Promise(async (resolve) => {
    await Context.current().sleep(timeout * 1000)

    const result = Sentencer.make(
      `{{ adjective }} {{ nouns }} went to the {{ noun }}`
    )

    console.log('result')

    console.log(result)
    resolve(result)
  })

  return Promise.race([ canceledPromise, activityPromise ])
    .then((real) => {
      heartbeatEnabled = false
      return real
    })
    .catch(() => {
      heartbeatEnabled = false
    })
}
