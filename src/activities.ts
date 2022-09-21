import Sentencer from "sentencer"
import { Context } from "@temporalio/activity"

export async function writeSentence(id: number): Promise<string> {
  const context = Context.current()
  await context.sleep(Math.floor(Math.random() * 30000))
  const result = Sentencer.make(
    `${id} {{ adjective }} {{ nouns }} went to the {{ noun }}`
  )

  console.log(result)
  return result
}
