# KsqlDB GraphQL API server

Automatic API generator for the KsqlDB REST API

## Getting started

### Install
```
npm i -S ksqldb-graphql
```

### Usage
```javascript
import { startServer } from 'ksqldb-graphql';

(async () => {
  await startServer("http://localhost:8088");
})();
```


