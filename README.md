### Steps to run this sample

1) Go to /temporal-server and run the following:
```
docker compose up
```

2) Run a local mongodb container using docker:

```
docker run -d --name mongo-codec -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=username -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

3) Run the following command to start the remote codec server

```
go run ./codec-server
```

4) Run the following command to start the worker

```
go run worker/main.go
```

5) Run the following command to start the example

```
go run starter/main.go
```

6) Run the following command and see the payloads cannot be decoded

```
tctl workflow show --wid encryption_workflowID
```

6) Run the following command and see the decoded payloads

```
tctl --codec_endpoint 'http://localhost:8081/' workflow show --wid encryption_workflowID
```
