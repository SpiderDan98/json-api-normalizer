// @ts-nocheck
import jsonApiNormalizer from "./index";
import * as errorResponse from "./jsons/responses/error.json";
import * as paginationResponse from "./jsons/responses/pagination.json";
import * as normalizedPagination from "./jsons/normalized/pagination.json";

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
    "jsonapi": {
        "version": "1.0"
    },
    "links": {
        "self": "http://localhost/api/v1/users/1"
    },
    "data": {
        "type": "users",
        "id": "1",
        "attributes": {
            "username": "SpiderDan98",
            "email": "danielkemna@t-online.de",
            "emailVerifiedAt": "1994-08-02T13:02:27.000000Z",
            "locale": "de",
            "roleId": 2,
            "createdAt": "2021-12-07T20:34:50.000000Z",
            "updatedAt": "2021-12-07T20:34:50.000000Z"
        },
        "relationships": {
            "tournaments": {
                "links": {
                    "related": "http://localhost/api/v1/users/1/tournaments",
                    "self": "http://localhost/api/v1/users/1/relationships/tournaments"
                }
            },
            "locations": {
                "links": {
                    "related": "http://localhost/api/v1/users/1/locations",
                    "self": "http://localhost/api/v1/users/1/relationships/locations"
                }
            },
            "reports": {
                "links": {
                    "related": "http://localhost/api/v1/users/1/reports",
                    "self": "http://localhost/api/v1/users/1/relationships/reports"
                }
            },
            "newsletter": {
                "links": {
                    "related": "http://localhost/api/v1/users/1/newsletter",
                    "self": "http://localhost/api/v1/users/1/relationships/newsletter"
                },
                "data": {
                    "type": "newsletters",
                    "id": "1"
                }
            }
        },
        "links": {
            "self": "http://localhost/api/v1/users/1"
        }
    },
    "included": [
        {
            "type": "newsletters",
            "id": "1",
            "attributes": {
                "email": "danielkemna@t-online.de",
                "name": "Hankeplatz",
                "radius": 10000,
                "latitude": -56.174582,
                "longitude": 160.988761,
                "currentPosition": true,
                "locale": "en",
                "createdAt": "1981-10-27T02:53:07.000000Z",
                "updatedAt": "2019-10-11T04:07:48.000000Z"
            },
            "relationships": {
                "creator": {
                    "links": {
                        "related": "http://localhost/api/v1/newsletters/1/creator",
                        "self": "http://localhost/api/v1/newsletters/1/relationships/creator"
                    }
                },
                "leagues": {
                    "links": {
                        "related": "http://localhost/api/v1/newsletters/1/leagues",
                        "self": "http://localhost/api/v1/newsletters/1/relationships/leagues"
                    },
                    "data": [
                        {
                            "type": "leagues",
                            "id": "1"
                        },
                        {
                            "type": "leagues",
                            "id": "2"
                        },
                        {
                            "type": "leagues",
                            "id": "3"
                        },
                        {
                            "type": "leagues",
                            "id": "4"
                        },
                        {
                            "type": "leagues",
                            "id": "5"
                        },
                        {
                            "type": "leagues",
                            "id": "6"
                        },
                        {
                            "type": "leagues",
                            "id": "7"
                        }
                    ]
                }
            },
            "links": {
                "self": "http://localhost/api/v1/newsletters/1"
            }
        },
        {
            "type": "leagues",
            "id": "1",
            "attributes": {
                "name": "Hobby",
                "shortcut": "H",
                "createdAt": null,
                "updatedAt": null
            },
            "links": {
                "self": "http://localhost/api/v1/leagues/1"
            }
        },
        {
            "type": "leagues",
            "id": "2",
            "attributes": {
                "name": "C-Liga",
                "shortcut": "C",
                "createdAt": null,
                "updatedAt": null
            },
            "links": {
                "self": "http://localhost/api/v1/leagues/2"
            }
        },
        {
            "type": "leagues",
            "id": "3",
            "attributes": {
                "name": "B-Liga",
                "shortcut": "B",
                "createdAt": null,
                "updatedAt": null
            },
            "links": {
                "self": "http://localhost/api/v1/leagues/3"
            }
        },
        {
            "type": "leagues",
            "id": "4",
            "attributes": {
                "name": "A-Liga",
                "shortcut": "A",
                "createdAt": null,
                "updatedAt": null
            },
            "links": {
                "self": "http://localhost/api/v1/leagues/4"
            }
        },
        {
            "type": "leagues",
            "id": "5",
            "attributes": {
                "name": "Bezirksliga",
                "shortcut": "BZ",
                "createdAt": null,
                "updatedAt": null
            },
            "links": {
                "self": "http://localhost/api/v1/leagues/5"
            }
        },
        {
            "type": "leagues",
            "id": "6",
            "attributes": {
                "name": "Bezirksoberliga",
                "shortcut": "BZO",
                "createdAt": null,
                "updatedAt": null
            },
            "links": {
                "self": "http://localhost/api/v1/leagues/6"
            }
        },
        {
            "type": "leagues",
            "id": "7",
            "attributes": {
                "name": "Bundesliga",
                "shortcut": "BL",
                "createdAt": null,
                "updatedAt": null
            },
            "links": {
                "self": "http://localhost/api/v1/leagues/7"
            }
        }
    ]
})));