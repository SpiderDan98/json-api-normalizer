import {
    JsonApiServerInformation,
    JsonApiLinks,
    JsonApiMeta,
    JsonApiResourceIdentifier
} from "@/types/json-api";

export interface JsonApiNormalized<Data = any, Meta = JsonApiMeta, Links = JsonApiLinks, JsonApi = JsonApiServerInformation> {
    data: JsonApiNormalizedData<Data>,
    errors?: JsonApiNormalizedErrors,
    jsonapi?: JsonApi,
    links?: Links,
    meta?: Meta,
}

export interface JsonApiNormalizedRelationship extends JsonApiResourceIdentifier {
    links?: JsonApiLinks<"self" | "related">,
    name: string,
}

export declare type JsonApiNormalizedErrors = Record<string, string | object>;

export declare type JsonApiNormalizedData<Data = any> = Data;