import { JsonApiDocument, JsonApiError, JsonApiRelationships, JsonApiResource } from "@/types/json-api";
import { JsonApiNormalized, JsonApiNormalizedData, JsonApiNormalizedErrors, JsonApiNormalizedRelationship } from "@/types/normalized";
import { Config } from "@/types/config";
declare const jsonApiNormalizer: (document: JsonApiDocument, config?: Config) => JsonApiNormalized | JsonApiNormalizedData;
export declare const jsonApiResourceNormalizer: (resource: JsonApiResource, included: JsonApiResource[], config: Config) => any;
export declare const jsonApiRelationshipNormalizer: (relationships: JsonApiRelationships) => JsonApiNormalizedRelationship[];
export declare const jsonApiErrorNormalizer: (errors: JsonApiError[], config: Config) => JsonApiNormalizedErrors;
export default jsonApiNormalizer;
