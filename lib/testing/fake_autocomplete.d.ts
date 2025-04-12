/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="google.maps" />
/// <reference types="jasmine" />
/** Creates a Jasmine spy to replace an Autocomplete object. */
export declare const makeFakeAutocomplete: () => jasmine.SpyObj<google.maps.places.Autocomplete>;
