/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="google.maps" />
type LatLng = google.maps.LatLng;
type LatLngLiteral = google.maps.LatLngLiteral;
type LatLngBounds = google.maps.LatLngBounds;
type LatLngBoundsLiteral = google.maps.LatLngBoundsLiteral;
/**
 * A fake `LatLng` class for testing purposes, that does not depend on the
 * `google.maps.LatLng` constructor loaded by the API.
 */
export declare class FakeLatLng implements LatLng {
    private readonly latitude;
    private readonly longitude;
    constructor(latitude: number, longitude: number);
    lat(): number;
    lng(): number;
    equals(other: LatLng): boolean;
    toUrlValue(): string;
    toJSON(): LatLngLiteral;
    toString(): string;
}
/**
 * A fake `LatLngBounds` class for testing purposes, that does not depend on the
 * `google.maps.LatLngBounds` constructor loaded by the API.
 */
export declare class FakeLatLngBounds implements LatLngBounds {
    private readonly boundsLiteral;
    constructor(boundsLiteral?: LatLngBoundsLiteral);
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    toJSON(): LatLngBoundsLiteral;
    union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
    contains(latLng: LatLng | LatLngLiteral): boolean;
    equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    extend(point: LatLng | LatLngLiteral): LatLngBounds;
    getCenter(): LatLng;
    intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    isEmpty(): boolean;
    toSpan(): LatLng;
    toUrlValue(precision?: number): string;
}
export {};
