var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import * as pointer from "json-pointer";
var defaultConfig = {
    onlyData: false,
    onlyError: true,
    includeErrors: true,
    includeJsonapi: true,
    includeLinks: true,
    includeMeta: true,
    includeId: true,
    includeType: true,
    ignorePointerPath: '/data/attributes',
    beforeResource: function (resource) { return resource; },
    afterResource: function (normalizedResource) { return normalizedResource; },
    beforeDataResource: function (resource) { return resource; },
    afterDataResource: function (normalizedResource) { return normalizedResource; },
    beforeRelationship: function (relationship) { return relationship; },
    afterRelationship: function (normalizedRelationship) { return normalizedRelationship; },
    beforeError: function (error) { return error; },
    afterError: function (normalizedError) { return normalizedError; }
};
var jsonApiNormalizer = function (document, config) {
    if (config === void 0) { config = {}; }
    config = __assign(__assign({}, defaultConfig), config);
    var normalized = { data: null };
    var included = document.included || [];
    if (Array.isArray(document.data)) {
        normalized.data = document.data.map(function (resource) {
            resource = config.beforeDataResource(resource);
            var normalizedResource = jsonApiResourceNormalizer(resource, included, config);
            return config.afterDataResource(normalizedResource, resource);
        });
    }
    if (!Array.isArray(document.data) && document.data) {
        var resource = config.beforeDataResource(document.data);
        var normalizedResource = jsonApiResourceNormalizer(resource, included, config);
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
};
export var jsonApiResourceNormalizer = function (resource, included, config) {
    resource = config.beforeResource(resource);
    var normalized = resource.attributes;
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
    var relationships = jsonApiRelationshipNormalizer(resource.relationships);
    var _loop_1 = function (relationship) {
        var relationshipResource = included.find(function (include) { return include.type === relationship.type && include.id === relationship.id; });
        if (relationshipResource) {
            var relationshipData = config.beforeRelationship(relationshipResource);
            var normalizedRelationship = jsonApiResourceNormalizer(relationshipData, included, config);
            normalized[relationship.name] = config.afterResource(normalizedRelationship, relationship);
        }
        if (!relationshipResource) {
            normalized[relationship.name] = undefined;
        }
    };
    for (var _i = 0, relationships_1 = relationships; _i < relationships_1.length; _i++) {
        var relationship = relationships_1[_i];
        _loop_1(relationship);
    }
    return config.afterResource(normalized, resource);
};
export var jsonApiRelationshipNormalizer = function (relationships) {
    var normalized = [];
    var _loop_2 = function (relationshipName) {
        var relationship = relationships[relationshipName].data;
        if (!relationship) {
            return "continue";
        }
        if (Array.isArray(relationship)) {
            normalized = __spreadArray(__spreadArray([], normalized, true), relationship.map(function (relationship) { return (__assign(__assign({}, relationship), { name: relationshipName })); }), true);
        }
        if (!Array.isArray(relationship)) {
            normalized.push(__assign(__assign({}, relationship), { name: relationshipName }));
        }
    };
    for (var _i = 0, _a = Object.keys(relationships); _i < _a.length; _i++) {
        var relationshipName = _a[_i];
        _loop_2(relationshipName);
    }
    return normalized;
};
export var jsonApiErrorNormalizer = function (errors, config) {
    var normalized = {};
    for (var _i = 0, errors_1 = errors; _i < errors_1.length; _i++) {
        var error = errors_1[_i];
        error = config.beforeError(error);
        pointer.set(normalized, error.source.pointer.replace(config.ignorePointerPath, ''), config.afterError(error.detail, error));
    }
    return normalized;
};
export default jsonApiNormalizer;
//# sourceMappingURL=index.js.map