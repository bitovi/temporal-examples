import Sentencer from "sentencer"
import { Context } from "@temporalio/activity"

export async function writeSentence(): Promise<string> {
  return Sentencer.make(`{{ adjective }} {{ nouns }} went to the {{ adjective }} {{ noun }}`)
}
