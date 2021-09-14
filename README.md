# json-api-normalizer

Utility package to normalize JSON API response data

# Description

json-api-normalizer helps to normalize [JSON API](http://jsonapi.org/).
Its supports all valid JSON API responses.

# Install

```shell
$ npm install @spiderdan98/json-api-normalizer
```

# Example

```JavaScript
import jsonApiNormalizer from '@spiderdan98/json-api-normalizer';

const json = {
    "meta": {
        "page": {
            "currentPage": 1,
            "from": 1,
            "lastPage": 1,
            "perPage": 3,
            "to": 3,
            "total": 3
        }
    },
    "jsonapi": {
        "version": "1.0"
    },
    "links": {
        "first": "http://localhost/api/v1/games",
        "last": "http://localhost/api/v1/games"
    },
    "data": [
        {
            "type": "games",
            "id": "1",
            "attributes": {
                "name": "Game 1"
            },
            "relationships": {
                "tournament": {
                    "data": {
                        "type": "tournaments",
                        "id": "1"
                    }
                }
            },
            "links": {
                "self": "http://localhost/api/v1/games/1"
            },
            "meta": {
                "foo": "game"
            }
        },
    ],
    "included": [
        {
            "type": "tournaments",
            "id": "1",
            "attributes": {
                "name": "Tournament 1"
            },
            "relationships": {
                "creator": {
                    "links": {
                        "related": "http://localhost/api/v1/tournaments/1/creator",
                        "self": "http://localhost/api/v1/tournaments/1/relationships/creator"
                    },
                    "data": {
                        "type": "users",
                        "id": "1"
                    }
                },
                "location": {
                    "links": {
                        "related": "http://localhost/api/v1/tournaments/1/location",
                        "self": "http://localhost/api/v1/tournaments/1/relationships/location"
                    },
                    "data": {
                        "type": "locations",
                        "id": "1"
                    }
                },
                "games": {
                    "links": {
                        "related": "http://localhost/api/v1/tournaments/1/games",
                        "self": "http://localhost/api/v1/tournaments/1/relationships/games"
                    }
                }
            },
            "links": {
                "self": "http://localhost/api/v1/tournaments/1"
            },
            "meta": {
                "foo": "tournament"
            }
        },
        {
            "type": "users",
            "id": "1",
            "attributes": {
                "username": "User 1"
            },
            "links": {
                "self": "http://localhost/api/v1/users/1"
            },
            "meta": {
                "foo": "user"
            }
        },
        {
            "type": "locations",
            "id": "1",
            "attributes": {
                "name": "Location 1"
            },
            "links": {
                "self": "http://localhost/api/v1/locations/1"
            },
            "meta": {
                "foo": "location"
            }
        }
    ]
}

console.log(jsonApiNormalizer(json));
/* Output:
{
  "data": [
    {
      "name": "Game 1",
      "id": "1",
      "type": "games",
      "links": {
        "self": "http://localhost/api/v1/games/1"
      },
      "meta": {
        "foo": "game"
      },
      "tournament": {
        "name": "Tournament 1",
        "id": "1",
        "type": "tournaments",
        "links": {
          "self": "http: //localhost/api/v1/tournaments/1"
        },
        "meta": {
          "foo": "tournament"
        },
        "creator": {
          "username": "User 1",
          "id": "1",
          "type": "users",
          "links": {
            "self": "http://localhost/api/v1/users/1"
          },
          "meta": {
            "foo": "user"
          }
        },
        "location": {
          "name": "Location1",
          "id": "1",
          "type": "locations",
          "links": {
            "self": "http: //localhost/api/v1/locations/1"
          },
          "meta": {
            "foo": "location"
          }
        }
      }
    }
  ],
  "jsonapi": {
    "version": "1.0"
  },
  "links": {
    "first": "http://localhost/api/v1/games",
    "last": "http://localhost/api/v1/games"
  },
  "meta": {
    "page": {
      "currentPage": 1,
      "from": 1,
      "lastPage": 1,
      "perPage": 3,
      "to": 3,
      "total": 3
    }
  }
}
*/
```

# Config

| Option             | Description                                              | Default            |
| ------------------ | -------------------------------------------------------- | ------------------ |
| onlyData           | If true it will return only the data content             | false              |
| onlyError          | If true and data is empty it will return only the errors | true               |
| includeErrors      | If true it will append errors                            | true               |
| includeJsonapi     | If true it will append jsonapi                           | true               |
| includeLinks       | If true it will append links                             | true               |
| includeMeta        | If true it will append meta                              | true               |
| includeId          | If true it will append the id to resources               | true               |
| includeType        | If true it will append the type to resources             | true               |
| ignorePointerPath  | The path to ignore by creating error object              | '/data/attributes' |
| beforeResource     | Triggers before a resource will be normalized            | none               |
| afterResource      | Triggers after a resource is normalized                  | none               |
| beforeDataResource | Triggers before a root resource will be normalized       | none               |
| afterDataResource  | Triggers after a root resource is normalized             | none               |
| beforeRelationship | Triggers before a relationship will be normalized        | none               |
| afterRelationship  | Triggers after a relationship is normalized              | none               |
| beforeError        | Triggers before a error is normalized                    | none               |
| afterError         | Triggers after a error is normalized                     | none               |