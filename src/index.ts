import {
    JsonApiDocument, JsonApiError,
    JsonApiRelationships,
    JsonApiResource
} from "types/json-api";
import {
    JsonApiNormalized,
    JsonApiNormalizedData,
    JsonApiNormalizedErrors,
    JsonApiNormalizedRelationship
} from "types/normalized";
import {Config} from "types/config";
import * as pointer from "json-pointer";

const defaultConfig: Config = {
    onlyData: false,
    onlyError: true,
    includeErrors: true,
    includeJsonapi: true,
    includeLinks: true,
    includeMeta: true,
    includeId: true,
    includeType: true,

    ignorePointerPath: '/data/attributes',

    beforeResource: resource => resource,
    afterResource: normalizedResource => normalizedResource,

    beforeDataResource: resource => resource,
    afterDataResource: normalizedResource => normalizedResource,

    beforeRelationship: relationship => relationship,
    afterRelationship: normalizedRelationship => normalizedRelationship,

    beforeError: error => error,
    afterError: normalizedError => normalizedError,
}

const jsonApiNormalizer = (document: JsonApiDocument, config: Config = {}): JsonApiNormalized | JsonApiNormalizedData => {
    config = {
        ...defaultConfig,
        ...config,
    }
    const normalized: JsonApiNormalized = {data: null};
    const included = document.included || [];

    if (Array.isArray(document.data)) {
        normalized.data = document.data.map(resource => {
            resource = config.beforeDataResource(resource);
            const normalizedResource = jsonApiResourceNormalizer(resource, included, config);

            return config.afterDataResource(normalizedResource, resource);
        });
    }

    if (!Array.isArray(document.data) && document.data) {
        const resource = config.beforeDataResource(document.data);
        const normalizedResource = jsonApiResourceNormalizer(resource, included, config);

        normalized.data = config.afterDataResource(normalizedResource, resource);
    }

    if (config.onlyData) {
        return normalized.data;
    }

    if (config.includeErrors && document.errors) {
        normalized.errors = jsonApiErrorNormalizer(document.errors, config);

        if (config.onlyError && !normalized.data) {
            return normalized.errors;
        }
    }

    if (config.includeJsonapi && document.jsonapi) {
        normalized.jsonapi = document.jsonapi;
    }

    if (config.includeLinks && document.links) {
        normalized.links = document.links;
    }

    if (config.includeMeta && document.meta) {
        normalized.meta = document.meta;
    }

    return normalized;
}

export const jsonApiResourceNormalizer = (resource: JsonApiResource, included: JsonApiResource[], config: Config) => {
    resource = config.beforeResource(resource);
    const normalized = resource.attributes;

    if (config.includeId) {
        normalized.id = resource.id;
    }

    if (config.includeType) {
        normalized.type = resource.type;
    }

    if (config.includeLinks) {
        normalized.links = resource.links;
    }

    if (config.includeMeta) {
        normalized.meta = resource.meta;
    }

    if (!resource.relationships) {
        return normalized;
    }

    const relationships: JsonApiNormalizedRelationship[] = jsonApiRelationshipNormalizer(resource.relationships);

    for (const relationship of relationships) {
        const relationshipResource = included.find(include => include.type === relationship.type && include.id === relationship.id);

        if (relationshipResource) {
            const relationshipData = config.beforeRelationship(relationshipResource);

            const normalizedRelationship = jsonApiResourceNormalizer(relationshipData, included, config);

            normalized[relationship.name] = config.afterResource(normalizedRelationship, relationship);
        }

        if (!relationshipResource) {
            normalized[relationship.name] = undefined;
        }
    }

    return config.afterResource(normalized, resource);
}

export const jsonApiRelationshipNormalizer = (relationships: JsonApiRelationships) => {
    let normalized: JsonApiNormalizedRelationship[] = [];

    for (const relationshipName of Object.keys(relationships)) {
        const relationship = relationships[relationshipName].data;

        if (!relationship) {
            continue;
        }

        if (Array.isArray(relationship)) {
            normalized = [
                ...normalized,
                ...relationship.map(relationship => ({
                    ...relationship,
                    name: relationshipName,
                })),
            ];
        }

        if (!Array.isArray(relationship)) {
            normalized.push({
                ...relationship,
                name: relationshipName,
            });
        }
    }

    return normalized;
}

export const jsonApiErrorNormalizer = (errors: JsonApiError[], config: Config) => {
    const normalized: JsonApiNormalizedErrors = {};

    for (let error of errors) {
        error = config.beforeError(error);
        pointer.set(
            normalized,
            error.source.pointer.replace(config.ignorePointerPath, ''),
            config.afterError(error.detail, error)
        );
    }

    return normalized;
}

export default jsonApiNormalizer;