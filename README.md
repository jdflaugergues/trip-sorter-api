# Trip Sorter Core

This project is the backend of the trip sorter application. It contains the API to get the cities available for a trip search, and another one to get the cheapest or fastest trip from a departure to an arrival. 

## Directory Structure

This project contains this mainly folder :

Directory       | Description
--------------- |-------------
`./__mocks__/`  | All mocks needed for the api (cities and all trips)
`./config/`     | Core configuration with log level, API mount point and port
`./scripts/`    | Utils for the API in particular the cities extraction of response.json data
`./src/`        | Sources of the core with the business logic and algorithm for a trip search
`./test`        | All AVA test of the API 

## Installation

```
npm install
```

## Test

```
npm test
```

## Start
```
npm start
```

## API Documentation

- [Cities](#cities)
	- [Search cities](#search-cities)
- [Trips](#trips)
	- [Search a trip](#search-a-trip)
	
### Cities

Route to search a city from the list of the cities available

#### Search cities	

	GET /cities

##### Query Parameters

| Name    | Type      | Description                          |
|---------|-----------|--------------------------------------|
| searchWord	  | String	  |  Cities to search 						 |


##### Examples

CURL example:

```
   curl -i -X GET http://localhost:5080/api/trip-sorter/cities?searchWord=p

```

##### Success Response

Success-Response (example):

```
   HTTP/1.1 200 OK
   ["Budapest","Paris","Prague"]

```

##### Error Response

Error-Response (example):

```
   HTTP/1.1 404 Not Found
   {
     "message": "no cities corresponding Cannes",
     "statusCode": 404
   }

```

### Trips

Route to search the cheapest and fastest trips for two cities given.
The results can be sorted throw a sort parameter.
The top ten of trips sorted is return.
The structure of the response is a JSON :

```
{
  "currency",   // the currency of trip cost
  "count",      // Number of result
  "trips": [    // The list of trips founded
    "steps": []     // The list of all step (same structure as response.json file)
    "cost",         // Total cost of all steps
    "duration"      // Total duration of all steps
  ]
}
```  

#### Search a trip	

	GET /trips

##### Query Parameters

| Name    | Type      | Mandatory | Description                          |
|---------|-----------|-----|--------------------------------|
| to	  | String	  | Yes | Deperture city                      |
| from	  | String	  | Yes | Arrival city                        |
| sort	  | String	  | No  | Attributes by which sort trips results |


##### Examples

CURL example:

```
   curl -i -X GET 'http://localhost:5080/api/trip-sorter/trips?from=Lisbon&to=Stockholm&sort=cost'

```

##### Success Response

Success-Response (example):

```
   HTTP/1.1 200 OK
   {
   "currency": "EUR",
   "count": 10,
   "trips": [
     {
       "steps": [
         {
           "transport": "bus",
           "departure": "Lisbon",
           "arrival": "Madrid",
           "duration": {
             "h": "07",
             "m": "45"
           },
           "cost": 40,
           "discount": 0,
           "reference": "BLM0745"
         },
         {
           "transport": "bus",
           "departure": "Madrid",
           "arrival": "Paris",
           "duration": {
             "h": "05",
             "m": "30"
           },
           "cost": 40,
           "discount": 50,
           "reference": "BMP0530"
         },
         {
           "transport": "bus",
           "departure": "Paris",
           "arrival": "Brussels",
           "duration": {
             "h": "06",
             "m": "30"
           },
           "cost": 40,
           "discount": 25,
           "reference": "BPB0630"
         },
         {
           "transport": "bus",
           "departure": "Brussels",
           "arrival": "Amsterdam",
           "duration": {
             "h": "05",
             "m": "15"
           },
           "cost": 40,
           "discount": 50,
           "reference": "BBA0515"
         },
         {
           "transport": "bus",
           "departure": "Amsterdam",
           "arrival": "Warsaw",
           "duration": {
             "h": "05",
             "m": "15"
           },
           "cost": 40,
           "discount": 25,
           "reference": "BAW0515"
         },
         {
           "transport": "bus",
           "departure": "Warsaw",
           "arrival": "Stockholm",
           "duration": {
             "h": "05",
             "m": "15"
           },
           "cost": 40,
           "discount": 50,
           "reference": "BWS0515"
         }
       ],
       "cost": 160,
       "duration": 2130
     },
     ...
   ]
   }

```

##### Error Response

Error-Response (example):

```
   HTTP/1.1 404 Not Found
   {
     "message": "city 'Cannes' not exist",
     "statusCode": 404
   }

```