/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="google.maps" />
import { PropertyValues } from 'lit';
import { BaseComponent } from '../base/base_component.js';
declare global {
    interface HTMLElementTagNameMap {
        'gmpx-api-loader': APILoader;
    }
}
/**
 * The API loader component loads the Google Maps Platform libraries necessary
 * for Extended Components.
 *
 * To use this component, make sure you [sign up for Google Maps Platform and
 * create an API
 * key](https://console.cloud.google.com/google/maps-apis/start).
 * By default, the API loader component will request the beta version of the
 * Maps JavaScript API, giving you access to additional components [`<gmp-map>`
 * and
 * `<gmp-advanced-marker>`](https://developers.google.com/maps/documentation/javascript/web-components/overview).
 * However, you can set the `version` attribute to select a stable (General
 * Availability) version of the SDK such as `weekly`.
 */
export declare class APILoader extends BaseComponent {
    /**
     * An alias for the `key` property. React developers should use this prop to
     * set the API key.
     */
    set apiKey(key: string | undefined);
    get apiKey(): string | undefined;
    /**
     * Maps JS customers can configure HTTP Referrer Restrictions in the Cloud
     * Console to limit which URLs are allowed to use a particular API Key. This
     * parameter can limit the amount of data sent to Google Maps when evaluating
     * HTTP Referrer Restrictions. Please see the
     * [documentation](https://developers.google.com/maps/documentation/javascript/dynamic-loading#optional_parameters)
     * for more information.
     */
    authReferrerPolicy?: string;
    /**
     * (Required) A valid Google Maps Platform API key. If you don't have one
     * already [sign up for Google Maps Platform and create an API
     * key](https://console.cloud.google.com/google/maps-apis/start).
     *
     * React developers are encouraged to use the `apiKey` property instead,
     * as `key` is a reserved word.
     *
     * You can learn more about API keys in the Google Maps Platform
     * [documentation](https://developers.google.com/maps/documentation/javascript/get-api-key).
     */
    key?: string;
    /**
     * The language code; defaults to the user's preferred language setting as
     * specified in the browser when displaying textual information. Read [more on
     * localization](https://developers.google.com/maps/documentation/javascript/localization).
     */
    language?: string;
    /**
     * The region code to use. This alters the map's behavior based on a given
     * country or territory. Read [more on region
     * codes](https://developers.google.com/maps/documentation/javascript/localization#Region).
     */
    region?: string;
    /**
     * To understand usage and ways to improve our solutions, Google includes the
     * `solution_channel` query parameter in API calls to gather information about
     * code usage. You may opt out at any time by setting this attribute to an
     * empty string. Read more in the
     * [documentation](https://developers.google.com/maps/reporting-and-monitoring/reporting#solutions-usage).
     */
    solutionChannel?: string;
    /**
     * The release channel or version numbers. See the
     * [documentation](https://developers.google.com/maps/documentation/javascript/versions)
     * for more information.
     */
    version: string;
    /** A deferred promise that resolves to the `google.maps` object. */
    private static googleMapsDeferred;
    /** Whether the inline script has been invoked by this component. */
    private static inlineScriptLoaded;
    /** A single instance of this component used to detect duplicates. */
    private static instance?;
    connectedCallback(): Promise<void>;
    protected willUpdate(changedProperties: PropertyValues<this>): void;
    protected render(): import("lit-html").TemplateResult<1>;
    private getSolutionChannel;
    private tryLoadGoogleMapsAPI;
    /**
     * Retrieves a reference to the specified Maps JavaScript API library.
     *
     * Libraries are [loaded dynamically from the Maps JavaScript
     * API](https://developers.google.com/maps/documentation/javascript/dynamic-loading).
     * If an instance of the API is not already available, one will be configured
     * and loaded based on a `<gmpx-api-loader>` element in the document.
     *
     * @param library Name of the library. Full list of libraries can be found in
     *     the
     *     [documentation](https://developers.google.com/maps/documentation/javascript/libraries).
     * @param consumer Optionally specify the custom element requesting the
     *     library to provide more helpful console warnings when a library cannot
     *     be loaded.
     * @returns {ReturnType<typeof google.maps.importLibrary>}
     * @nocollapse
     */
    static importLibrary(library: string, consumer?: HTMLElement): Promise<google.maps.PlacesLibrary | google.maps.CoreLibrary | google.maps.MapsLibrary | google.maps.GeocodingLibrary | google.maps.RoutesLibrary | google.maps.MarkerLibrary | google.maps.GeometryLibrary | google.maps.ElevationLibrary | google.maps.StreetViewLibrary | google.maps.JourneySharingLibrary | google.maps.DrawingLibrary | google.maps.VisualizationLibrary>;
    /**
     * Resets API loader state and removes `google.maps` from the global scope.
     * This method should be invoked for testing purposes only.
     * @ignore
     */
    static reset(): void;
    /** @nocollapse */
    private static pollForGoogleMaps;
}
