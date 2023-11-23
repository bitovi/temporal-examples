# script will return exit code 0 if successful, or 123 if any history fails to replay 

cd "$(dirname "${BASH_SOURCE[0]}")"

# samples 5 random active workflow ids and downloads history
tctl workflow listall --open --workflow_type basicWorkflow \
  |  awk '{ print $3; }' \
  |  tail -n+2 \
  |  shuf -n 5 \
  |  xargs -I {} tctl workflow show -w {} -of ./{}_history.json

# replay & test each downloaded history
ls -a | grep _history.json | xargs -L1 ./replay_test.ts