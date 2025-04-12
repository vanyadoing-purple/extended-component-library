/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { FakeLatLng, FakeLatLngBounds } from './fake_lat_lng.js';
const EMPTY_FAKE_ROUTE = {
    bounds: new FakeLatLngBounds(),
    copyrights: '',
    legs: [],
    overview_path: [],
    overview_polyline: '',
    summary: '',
    warnings: [],
    waypoint_order: [],
};
const EMPTY_FAKE_LEG = {
    end_address: '',
    end_location: new FakeLatLng(0, 0),
    start_address: '',
    start_location: new FakeLatLng(0, 0),
    steps: [],
    traffic_speed_entry: [],
    via_waypoints: [],
};
const EMPTY_FAKE_STEP = {
    encoded_lat_lngs: '',
    path: [],
    end_location: new FakeLatLng(0, 0),
    end_point: new FakeLatLng(0, 0),
    instructions: '',
    lat_lngs: [],
    maneuver: '',
    start_location: new FakeLatLng(0, 0),
    start_point: new FakeLatLng(0, 0),
    travel_mode: 'DRIVING',
};
/**
 * Makes a fake `google.maps.DirectionsRoute` object for testing purposes.
 *
 * @param fields - An object of fields of the `DirectionsRoute`. Any fields not
 *     provided will default to empty strings, empty arrays, or an empty
 *     LatLngBounds.
 */
export function makeFakeRoute(fields = {}) {
    return { ...EMPTY_FAKE_ROUTE, ...fields };
}
/**
 * Makes a fake `google.maps.DirectionsLeg` object for testing purposes.
 *
 * @param fields - An object of fields of the `DirectionsLeg`. Any fields not
 *     provided will default to empty strings, empty arrays, or the LatLng
 *     (0, 0).
 */
export function makeFakeLeg(fields = {}) {
    return { ...EMPTY_FAKE_LEG, ...fields };
}
/**
 * Makes a fake `google.maps.DirectionsStep` object for testing purposes.
 *
 * @param fields - An object of fields of the `DirectionsStep`. Any fields
 *     not provided will default to empty strings, empty arrays, the LatLng
 *     (0, 0), or the 'DRIVING' travel mode.
 */
export function makeFakeStep(fields = {}) {
    return { ...EMPTY_FAKE_STEP, ...fields };
}
//# sourceMappingURL=fake_route.js.map