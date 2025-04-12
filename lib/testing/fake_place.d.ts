/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="google.maps" />
import type { Photo, Place } from '../utils/googlemaps_types.js';
type PlacePhoto = google.maps.places.PlacePhoto;
/**
 * Makes a fake `google.maps.places.Place` object for testing purposes. The fake
 * place is recognized as a `Place` by the type checker, but does not depend on
 * loading the API. It is *not* recognized as an `instanceof` the `Place`
 * constructor loaded with the API.
 *
 * @param fields - An object of fields of the `Place`. The `id` field is
 *     required and the rest are optional.
 */
export declare function makeFakePlace(fields: Pick<Place, 'id'> & Partial<Place>): Place;
/**
 * Makes a fake `google.maps.places.Photo` object for testing purposes.
 *
 * @param fields - An object containing values of `Photo` fields.
 * @param uri - The URI to return when `getURI()` is called.
 */
export declare function makeFakePhoto(fields: Omit<Photo, 'getURI'>, uri: string): Photo;
/**
 * Makes a fake `google.maps.places.PlacePhoto` object for testing purposes.
 *
 * @param fields - An object containing values of `PlacePhoto` fields.
 * @param uri - The URI to return when `getUrl()` is called.
 */
export declare function makeFakePlacePhoto(fields: Omit<PlacePhoto, 'getUrl'>, uri: string): PlacePhoto;
/** A sample `google.maps.places.Place` object for testing purposes. */
export declare const SAMPLE_FAKE_PLACE: google.maps.places.Place;
/** A sample `google.maps.places.PlaceResult` object for testing purposes. */
export declare const SAMPLE_FAKE_PLACE_RESULT: google.maps.places.PlaceResult;
export {};
