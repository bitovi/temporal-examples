package encryption

import (
	"context"
	"time"

	"github.com/bitovi/temporal-examples/types"
	"go.temporal.io/sdk/activity"
	"go.temporal.io/sdk/workflow"
)

// Workflow is a standard workflow definition.
// Note that the Workflow and Activity don't need to care that
// their inputs/results are being encrypted/decrypted.
func Workflow(ctx workflow.Context, sampleObj types.SampleObj) (types.SampleObj, error) {
	ao := workflow.ActivityOptions{
		StartToCloseTimeout: 10 * time.Second,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	logger := workflow.GetLogger(ctx)
	logger.Info("Encrypted Payloads workflow started", "sampleObj", sampleObj)

	var result types.SampleObj
	err := workflow.ExecuteActivity(ctx, Activity, sampleObj).Get(ctx, &result)
	if err != nil {
		logger.Error("Activity failed.", "Error", err)
		return result, err
	}
	logger.Info("Encrypted Payloads workflow completed.", "result", result)

	return result, nil
}

func Activity(ctx context.Context, info types.SampleObj) (types.SampleObj, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("Activity", "info", info)
	return info, nil
}
