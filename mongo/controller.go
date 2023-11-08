package mongo

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Controller struct {
	client *mongo.Client
	db     *mongo.Database
}

const DefaultTimeout = 10 * time.Second

// We'll need to create our own mongo client and pass it through to be
// used by our codec server
func NewMongoController() *Controller {

	dbUri := "mongodb://username:password@0.0.0.0:27017"
	clientOptions := options.Client().ApplyURI(dbUri)

	mongoClient, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		return nil
	}

	return &Controller{
		client: mongoClient,
		db:     mongoClient.Database("codec-db"),
	}
}

func (c Controller) InsertRecord(collectionName string, record any) error {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel() // releases resources if slowOperation completes before timeout elapses

	_, err := c.db.Collection(collectionName).InsertOne(ctx, record)

	if err != nil {
		return err
	}

	return nil
}

func (c Controller) RetrieveRecord(collectionName string, uuid string) (any, error) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel() // releases resources if slowOperation completes before timeout elapses
	filter := bson.M{"_id": uuid}

	var codexedObj map[string]interface{}

	err := c.db.Collection(collectionName).FindOne(ctx, filter).Decode(&codexedObj)
	if err != nil {
		return nil, err
	}
	return codexedObj, nil
}

func (c Controller) Drop(ctx context.Context, collectionName string) error {
	return c.db.Collection(collectionName).Drop(ctx)
}

func (c Controller) Close(ctx context.Context) {
	c.client.Disconnect(ctx)
}
