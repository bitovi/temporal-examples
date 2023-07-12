import Sentencer from 'sentencer'
import { Context } from '@temporalio/activity'

export async function writeSentence(timeout: number): Promise<any> {
  const cancelPromise = Context.current().cancelled

  const realPromise = new Promise(async (resolve, reject) => {
    Context.current().heartbeat(0)

    await Context.current().sleep(timeout * 1000)
    console.log('timeout complete')

    Context.current().heartbeat(50)

    const result = Sentencer.make(
      `{{ adjective }} {{ nouns }} went to the {{ noun }}`
    )

    Context.current().heartbeat(100)

    console.log(result)
    resolve(result)
  })

  return Promise.any([ cancelPromise, realPromise ])
    .then((real) => {
      return real
    })
    .catch((cancel) => {
      console.log('canceled')
      return ''
    })
}
