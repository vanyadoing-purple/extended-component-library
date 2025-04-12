/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="google.maps" />
type DirectionsRoute = google.maps.DirectionsRoute;
type DirectionsLeg = google.maps.DirectionsLeg;
type DirectionsStep = google.maps.DirectionsStep;
/**
 * Makes a fake `google.maps.DirectionsRoute` object for testing purposes.
 *
 * @param fields - An object of fields of the `DirectionsRoute`. Any fields not
 *     provided will default to empty strings, empty arrays, or an empty
 *     LatLngBounds.
 */
export declare function makeFakeRoute(fields?: Partial<DirectionsRoute>): DirectionsRoute;
/**
 * Makes a fake `google.maps.DirectionsLeg` object for testing purposes.
 *
 * @param fields - An object of fields of the `DirectionsLeg`. Any fields not
 *     provided will default to empty strings, empty arrays, or the LatLng
 *     (0, 0).
 */
export declare function makeFakeLeg(fields?: Partial<DirectionsLeg>): DirectionsLeg;
/**
 * Makes a fake `google.maps.DirectionsStep` object for testing purposes.
 *
 * @param fields - An object of fields of the `DirectionsStep`. Any fields
 *     not provided will default to empty strings, empty arrays, the LatLng
 *     (0, 0), or the 'DRIVING' travel mode.
 */
export declare function makeFakeStep(fields?: Partial<DirectionsStep>): DirectionsStep;
export {};
