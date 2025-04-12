/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="google.maps" />
/// <reference types="jasmine" />
import { SearchByTextRequest } from '../utils/googlemaps_types.js';
/**
 * Sets up a fake instance of the Google Maps SDK which can be used as-is or
 * modified in tests.
 */
export declare class FakeGoogleMapsHarness {
    /**
     * Override this function to customize how `google.maps.places.Place` is
     * instantiated.
     */
    placeConstructor: (options: google.maps.places.PlaceOptions) => google.maps.places.Place;
    /**
     * Override this function to control the response of a
     * `google.maps.places.PlacesService.getDetails()` request.
     */
    getDetailsHandler: (request: google.maps.places.PlaceDetailsRequest) => {
        result: google.maps.places.PlaceResult;
        status: string;
    };
    /**
     * Override this function to control the response of a
     * `google.maps.DirectionsService.route()` request.
     */
    routeHandler: (request: google.maps.DirectionsRequest) => Promise<google.maps.DirectionsResult>;
    /**
     * Override this function to control the response of a
     * `google.maps.DistanceMatrixService.getDistanceMatrix()` request.
     */
    distanceMatrixHandler: (request: google.maps.DistanceMatrixRequest) => google.maps.DistanceMatrixResponse;
    /**
     * Override this function to control the response of a
     * `google.maps.places.PlacesService.findPlaceFromQuery()` request.
     */
    findPlaceFromQueryGAHandler: (request: google.maps.places.FindPlaceFromQueryRequest) => {
        results: google.maps.places.PlaceResult[];
        status: string;
    };
    /**
     * Override this function to control the response of `Place.searchByText()`.
     */
    searchByTextHandler: (request: SearchByTextRequest) => {
        places: google.maps.places.Place[];
    };
    /**
     * Spy for the fake Places Autocomplete.
     */
    autocompleteSpy: jasmine.SpyObj<google.maps.places.Autocomplete>;
    /**
     * Override this function to control the constructor for
     * `google.maps.places.Autocomplete`.
     */
    autocompleteConstructor: (input: HTMLInputElement, options?: google.maps.places.AutocompleteOptions) => jasmine.SpyObj<google.maps.places.Autocomplete>;
    /**
     * Collection of libraries that are dispatched via `importLibrary()`.
     * Override libraries in this structure to augment or modify the behavior of
     * Fake Google Maps.
     */
    readonly libraries: {
        [libraryName: string]: any;
    };
    /** This is an object that can be substituted for `google.maps`. */
    readonly sdk: typeof google.maps;
    constructor();
    importLibrary(libraryName: string): ReturnType<typeof google.maps.importLibrary>;
}
