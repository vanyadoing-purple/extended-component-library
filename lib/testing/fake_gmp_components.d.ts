/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="google.maps" />
/// <reference types="jasmine" />
import { LitElement } from 'lit';
import { LatLng, LatLngLiteral } from '../utils/googlemaps_types.js';
declare global {
    interface HTMLElementTagNameMap {
        'gmp-map': FakeMapElement;
        'gmp-advanced-marker': FakeAdvancedMarkerElement;
    }
}
/** A fake `google.maps.MapElement` class for testing purposes. */
export declare class FakeMapElement extends LitElement {
    center: LatLng | LatLngLiteral | null;
    readonly innerMap: jasmine.SpyObj<google.maps.Map>;
    mapId: string | null;
    zoom: number | null;
}
/**
 * A fake `google.maps.AdvancedMarkerElement` class for testing purposes.
 */
export declare class FakeAdvancedMarkerElement extends LitElement {
    position?: LatLng | null;
    zIndex?: number | null;
    title: string;
    map?: google.maps.Map | null;
    innerContent?: Element | null;
    set content(content: Element | null | undefined);
    get content(): Element | null | undefined;
}
