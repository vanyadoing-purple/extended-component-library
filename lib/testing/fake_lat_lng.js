/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A fake `LatLng` class for testing purposes, that does not depend on the
 * `google.maps.LatLng` constructor loaded by the API.
 */
export class FakeLatLng {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    lat() {
        return this.latitude;
    }
    lng() {
        return this.longitude;
    }
    equals(other) {
        return this.lat() === other.lat() && this.lng() === other.lng();
    }
    toUrlValue() {
        throw new Error('toUrlValue is not implemented');
    }
    toJSON() {
        return { 'lat': this.latitude, 'lng': this.longitude };
    }
    toString() {
        return `(${this.latitude},${this.longitude})`;
    }
}
function isLatLngBoundsLiteral(bounds) {
    return (typeof bounds.north === 'number');
}
/**
 * A fake `LatLngBounds` class for testing purposes, that does not depend on the
 * `google.maps.LatLngBounds` constructor loaded by the API.
 */
export class FakeLatLngBounds {
    constructor(boundsLiteral = {
        north: -90,
        south: 90,
        east: -180,
        west: 180
    }) {
        this.boundsLiteral = boundsLiteral;
    }
    getNorthEast() {
        return new FakeLatLng(this.boundsLiteral.north, this.boundsLiteral.east);
    }
    getSouthWest() {
        return new FakeLatLng(this.boundsLiteral.south, this.boundsLiteral.west);
    }
    toJSON() {
        return this.boundsLiteral;
    }
    union(other) {
        const { north, south, east, west } = this.boundsLiteral;
        const otherLiteral = isLatLngBoundsLiteral(other) ? other : other.toJSON();
        this.boundsLiteral.north = Math.max(north, otherLiteral.north);
        this.boundsLiteral.south = Math.min(south, otherLiteral.south);
        this.boundsLiteral.east = Math.max(east, otherLiteral.east);
        this.boundsLiteral.west = Math.min(west, otherLiteral.west);
        return this;
    }
    contains(latLng) {
        throw new Error('contains is not implemented');
    }
    equals(other) {
        throw new Error('equals is not implemented');
    }
    extend(point) {
        const lat = typeof point.lat === 'function' ? point.lat() : point.lat;
        const lng = typeof point.lng === 'function' ? point.lng() : point.lng;
        return this.union({ north: lat, south: lat, east: lng, west: lng });
    }
    getCenter() {
        throw new Error('getCenter is not implemented');
    }
    intersects(other) {
        throw new Error('intersects is not implemented');
    }
    isEmpty() {
        throw new Error('isEmpty is not implemented');
    }
    toSpan() {
        throw new Error('toSpan is not implemented');
    }
    toUrlValue(precision) {
        throw new Error('toUrlValue is not implemented');
    }
}
//# sourceMappingURL=fake_lat_lng.js.map