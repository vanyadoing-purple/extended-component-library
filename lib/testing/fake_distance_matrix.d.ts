/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="google.maps" />
export declare const FAKE_DM_VALUE = 101;
/**
 * Creates a fake Distance Matrix response, based on a map `fakeDistances` that
 * specifies the resulting distance for a given _destination_ point. If a
 * destination isn't found in the map, 101 is used as the distance.
 */
export declare function makeFakeDistanceMatrixResponse(request: google.maps.DistanceMatrixRequest, fakeDistances?: Map<unknown, number>): google.maps.DistanceMatrixResponse;
