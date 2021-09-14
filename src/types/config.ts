import {JsonApiError, JsonApiResource} from "@/types/json-api";

export interface Config {
    onlyData?: boolean,
    onlyError?: boolean,
    includeJsonapi?: boolean,
    includeErrors?: boolean,
    includeLinks?: boolean,
    includeMeta?: boolean,
    includeId?: boolean,
    includeType?: boolean,

    ignorePointerPath?: string,

    beforeResource?: (resource: JsonApiResource) => JsonApiResource,
    afterResource?: (normalizedResource: any, resource: JsonApiResource) => any,

    beforeDataResource?: (resource: JsonApiResource) => JsonApiResource,
    afterDataResource?: (normalizedResource: any, resource: JsonApiResource) => any,

    beforeRelationship?: (relationship: JsonApiResource) => JsonApiResource,
    afterRelationship?: (normalizedRelationship: any, relationship: JsonApiResource) => any,

    beforeError?: (error: JsonApiError) => JsonApiError,
    afterError?: (normalizedError: any, error: JsonApiError) => any,
}