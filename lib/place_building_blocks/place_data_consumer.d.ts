/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="google.maps" />
import { PropertyValues } from 'lit';
import { BaseComponent } from '../base/base_component.js';
import type { Place, PlaceResult } from '../utils/googlemaps_types.js';
/**
 * Registration functions passed from a `PlaceDataProvider` via context. The
 * `PlaceDataConsumer` calls these to register/unregister itself with the data
 * provider, allowing the provider to get its required fields and trigger
 * updates when place data is loaded.
 */
export interface PlaceConsumerRegistration {
    registerPlaceConsumer: (consumer: PlaceDataConsumer) => void;
    unregisterPlaceConsumer: (consumer: PlaceDataConsumer) => void;
}
export declare const placeContext: {
    __context__: google.maps.places.Place | undefined;
};
export declare const placeConsumerRegistrationContext: {
    __context__: PlaceConsumerRegistration;
};
/**
 * Base class for components which render Place data provided elsewhere; i.e.
 * Place Representation Building Blocks.
 *
 * This class implements functionality to retrieve a `Place` or `PlaceResult`
 * via context from a parent `<gmpx-place-data-provider>` component.
 */
export declare abstract class PlaceDataConsumer extends BaseComponent {
    /**
     * @ignore
     * Place consumer registration functions, passed from a parent
     * `PlaceDataProvider` via context.
     */
    contextRegistration?: PlaceConsumerRegistration;
    /**
     * @ignore
     * Place data passed from a parent `PlaceDataProvider` via context.
     */
    contextPlace: Place | undefined;
    /**
     * Place data to render, overriding anything provided by context.
     */
    get place(): Place | PlaceResult | null | undefined;
    set place(value: Place | PlaceResult | null | undefined);
    /**
     * This read-only property and attribute indicate whether the component
     * has the required Place data to display itself.
     *
     * Use the attribute to target CSS rules if you wish to hide this component,
     * or display alternate content, when there's no valid data.
     */
    noData: boolean;
    private placeV2?;
    private placeInternal?;
    protected willUpdate(changedProperties: PropertyValues): void;
    disconnectedCallback(): void;
    /**
     * Callback to be invoked when the object returned by calling `getPlace()`
     * changes, including when fields in the object are newly populated.
     *
     * @param value New value of the object returned by `getPlace()`.
     * @param oldValue Old value of the object returned by `getPlace()`.
     */
    protected placeChangedCallback(value?: Place | null, oldValue?: Place | null): void;
    /**
     * @ignore
     * Components should override this method if they wish to show a `no-data`
     * attribute for use with CSS styling.
     */
    protected placeHasData(place: Place): boolean;
    /**
     * @ignore
     * Returns any Place fields required for this component to render content.
     *
     * A parent `<gmpx-place-data-provider>` component will call this method
     * before making an API call to determine which Place fields to request.
     */
    abstract getRequiredFields(): Array<keyof Place>;
    /**
     * Returns the Place data object to be used when rendering.
     *
     * If a `Place` or `PlaceResult` object is specified directly on the component
     * as a property, it will take priority. Otherwise, this method attempts to
     * return one provided by a parent `<gmpx-place-data-provider>` element.
     *
     * The convention for data providers is to use `undefined` to indicate Place
     * data has not been requested, or is in the process of being requested. The
     * value `null` indicates that Place data could not be found.
     */
    protected getPlace(): Place | null | undefined;
    private updatePlaceV2;
}
