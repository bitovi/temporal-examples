#!/usr/bin/env -S npx ts-node-esm
// replay_test.ts {history_file}
import fs from 'fs'
import { Worker } from "@temporalio/worker"

const filePath = process.argv[2]
const history = JSON.parse(await fs.promises.readFile(filePath, 'utf8'))
const workflowsPath = new URL('../src/workflows.ts', import.meta.url).toString().replace('file://', '')

await Worker.runReplayHistory({ workflowsPath }, history)