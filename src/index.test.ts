// @ts-nocheck
import jsonApiNormalizer from "index";
import * as errorResponse from "jsons/responses/error.json";
import * as paginationResponse from "jsons/responses/pagination.json";
import * as normalizedPagination from "jsons/normalized/pagination.json";

test('test normalize json api pagination response', () => {
    const normalized = jsonApiNormalizer(paginationResponse);

    expect(normalized).toEqual({
        data: normalizedPagination.data,
        meta: paginationResponse.meta,
        jsonapi: paginationResponse.jsonapi,
        links: paginationResponse.links,
    });

    expect(normalized).not.toEqual({
        included: paginationResponse.included,
    });
});

test('test normalize json api pagination response only data', () => {
    const normalized = jsonApiNormalizer(paginationResponse, {
        onlyData: true,
    });

    expect(normalized).toEqual(normalizedPagination.data);

    expect(normalized).not.toEqual({
        included: paginationResponse.included,
        meta: paginationResponse.meta,
        jsonapi: paginationResponse.jsonapi,
        links: paginationResponse.links,
    });
});

test('test normalize json api pagination response events', () => {
    const counters = {
        resources: 0,
        dataResources: 0,
        relationships: 0,
    }

    jsonApiNormalizer(paginationResponse, {
        beforeRelationship: relationship => {
            counters.relationships++;
            return relationship;
        },
        beforeResource: resource => {
            counters.resources++;
            return resource;
        },
        beforeDataResource: resource => {
            counters.dataResources++;
            return resource;
        },
    });

    expect(counters).toEqual({
        dataResources: 3,
        relationships: 9,
        resources: 12,
    });
});

test('test normalize json api errors', () => {
    const normalized = jsonApiNormalizer(errorResponse);

    expect(normalized).toEqual({
        name: "This combination of Name, Street, City already exists.",
        tournament: {
            league: "The field league is required.",
        },
        tournaments: [
            {league: "The field league is required."},
            ,
            ,
            ,
            {league: "The field league is required."},
        ],
    });
});

test('test normalize json api error events', () => {
    let errorCounter = 0;

    jsonApiNormalizer(errorResponse, {
        beforeError: error => {
            errorCounter++;
            return error;
        },
    });

    expect(errorCounter).toEqual(4);
});

console.log(JSON.stringify(jsonApiNormalizer({
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
})));