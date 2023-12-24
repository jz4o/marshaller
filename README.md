# marshaller

marshaller is API that exchanges data with google spreadsheet.

## usage

### create google apps script project

1. access to google drive
1. create spread sheet
1. open google apps script
    * Extensions > Apps Script
1. copy script id
    * Project Settings > IDs > Script ID

### push source code to google apps script project

1. `git clone ...`
1. `docker-compose build`
1. `docker-compose up -d`
1. `cp -p .clasp.json.example .clasp.json`
1. `vim .clasp.json`
1. `docker-compose exec clasp npx clasp login --no-localhost`
    * if can't login
      1. `docker-compose exec clasp apk add curl`
      1. `docker-compose exec clasp npx clasp login`
      1. `docker-compose exec clasp curl localhost:XXXXX` from another terminal after view `This site cannot be accessed` page
1. `docker-compose exec clasp npx clasp push`

### setting google apps script

1. open google apps script
1. run `setAPIToken`
1. copy api token
    * Project Settings > Script Properties > API_TOKEN
1. deploy
    * Deploy > New deployment > Select type > Web app

      |Description|Execute as|Who has access|
      |-----------|----------|--------------|
      |Any        |Me        |Anyone        |
1. copy deployed url

### test run

insert data

```
$ api_url="your deployed url"
$ token="your api token"
$ parameter='{ "sheet": "test", "data": { "column1": "value1", "column2": "value2" } }'
$ curl -X POST -H "Content-Type: application/json" -d "{ \"token\": \"$token\", \"parameter\": $parameter }" $api_url
```

get data

```
$ api_url="your deployed url"
$ token="your api token"
$ parameter="sheet=test"
$ curl -sL "$api_url?token=$token&$parameter"
```

