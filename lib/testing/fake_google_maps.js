/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { makeFakeAutocomplete } from './fake_autocomplete.js';
import { makeFakeDistanceMatrixResponse } from './fake_distance_matrix.js';
import { FakeAdvancedMarkerElement, FakeMapElement } from './fake_gmp_components.js';
import { FakeLatLng, FakeLatLngBounds } from './fake_lat_lng.js';
import { makeFakePlace } from './fake_place.js';
import { makeFakeRoute } from './fake_route.js';
/**
 * Sets up a fake instance of the Google Maps SDK which can be used as-is or
 * modified in tests.
 */
export class FakeGoogleMapsHarness {
    // tslint:disable:enforce-name-casing
    constructor() {
        /**
         * Override this function to customize how `google.maps.places.Place` is
         * instantiated.
         */
        this.placeConstructor = (options) => makeFakePlace({ id: options.id });
        /**
         * Override this function to control the response of a
         * `google.maps.places.PlacesService.getDetails()` request.
         */
        this.getDetailsHandler = (request) => ({
            result: {},
            status: 'OK',
        });
        /**
         * Override this function to control the response of a
         * `google.maps.DirectionsService.route()` request.
         */
        this.routeHandler = (request) => Promise.resolve({
            routes: [makeFakeRoute()],
        });
        /**
         * Override this function to control the response of a
         * `google.maps.DistanceMatrixService.getDistanceMatrix()` request.
         */
        this.distanceMatrixHandler = (request) => makeFakeDistanceMatrixResponse(request);
        /**
         * Override this function to control the response of a
         * `google.maps.places.PlacesService.findPlaceFromQuery()` request.
         */
        this.findPlaceFromQueryGAHandler = (request) => ({ results: [], status: 'OK' });
        /**
         * Override this function to control the response of `Place.searchByText()`.
         */
        this.searchByTextHandler = (request) => ({ places: [] });
        /**
         * Spy for the fake Places Autocomplete.
         */
        this.autocompleteSpy = makeFakeAutocomplete();
        /**
         * Override this function to control the constructor for
         * `google.maps.places.Autocomplete`.
         */
        this.autocompleteConstructor = (input, options) => this.autocompleteSpy;
        const harness = this;
        this.libraries = {
            'core': {
                LatLng: FakeLatLng,
                LatLngBounds: FakeLatLngBounds,
                UnitSystem: { IMPERIAL: 0, METRIC: 1 },
            },
            'maps': {
                Map: FakeMapElement,
                Polyline: class {
                    setMap() { }
                    setPath() { }
                    setOptions() { }
                }
            },
            'marker': {
                AdvancedMarkerElement: FakeAdvancedMarkerElement,
            },
            'places': {
                Autocomplete: class {
                    constructor(input, options) {
                        return harness.autocompleteConstructor(input, options);
                    }
                },
                Place: class {
                    constructor(options) {
                        return harness.placeConstructor(options);
                    }
                    static searchByText(request) {
                        return Promise.resolve(harness.searchByTextHandler(request));
                    }
                },
                PlacesService: class {
                    getDetails(options, callback) {
                        const { result, status } = harness.getDetailsHandler(options);
                        callback(result, status);
                    }
                    findPlaceFromQuery(options, callback) {
                        const { results, status } = harness.findPlaceFromQueryGAHandler(options);
                        callback(results, status);
                    }
                }
            },
            'routes': {
                DirectionsService: class {
                    route(request) {
                        return harness.routeHandler(request);
                    }
                },
                DistanceMatrixService: class {
                    getDistanceMatrix(request) {
                        return Promise.resolve(harness.distanceMatrixHandler(request));
                    }
                }
            },
            'geometry': {
                spherical: {
                    /**
                     * Fake spherical geometry calculation returns the difference in
                     * `lat` values.
                     */
                    computeDistanceBetween(from, to) {
                        const getLat = (x) => typeof x.lat === 'function' ? x.lat() : x.lat;
                        return Math.abs(getLat(from) - getLat(to));
                    }
                }
            }
        };
        this.sdk = {
            importLibrary: (libraryName) => this.importLibrary(libraryName),
        };
    }
    importLibrary(libraryName) {
        const library = this.libraries[libraryName];
        if (library) {
            return Promise.resolve(library);
        }
        throw new Error(`Fake Maps library ${library} not implemented.`);
    }
}
//# sourceMappingURL=fake_google_maps.js.map