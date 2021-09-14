import {ErrorStatusCodes} from "@/types/status-codes";

export interface JsonApiDocument<Meta = JsonApiMeta> {
    data?: JsonApiResource | JsonApiResource[] | null,
    errors?: JsonApiError[],
    meta?: Meta,
    jsonapi?: JsonApiServerInformation,
    links?: JsonApiLinks,
    included?: JsonApiResource[],
}

export declare type JsonApiServerInformation = any;

export declare type JsonApiMeta = any;

export declare type JsonApiLinks<Keys extends string = any> = JsonApiLinkObject<Keys> | JsonApiLinkObject<Keys>[];

export declare type JsonApiLinkObject<Key extends string> = Record<Key, {
    href: string,
    meta: any,
} | string>

export interface JsonApiError<Meta = JsonApiMeta> {
    id?: string,
    links?: JsonApiLinks<"about">,
    status?: ErrorStatusCodes,
    code?: string,
    title?: string,
    detail?: string,
    source?: JsonApiSource,
    meta?: Meta,
}

export interface JsonApiSource {
    pointer: string,
    parameter?: string,
}

export interface JsonApiResourceIdentifier<Meta = JsonApiMeta> {
    id: string,
    type: string,
    meta?: Meta,
}

export interface JsonApiResource extends JsonApiResourceIdentifier {
    attributes?: any,
    relationships?: JsonApiRelationships,
    links?: JsonApiLinks,
}

export declare type JsonApiRelationships<Key extends string = any> = Record<Key, JsonApiRelationship>;

export interface JsonApiRelationship<Meta = JsonApiMeta> {
    links?: JsonApiLinks<"self" | "related">,
    data?: JsonApiResourceIdentifier | JsonApiResourceIdentifier[],
    meta?: Meta,
}
