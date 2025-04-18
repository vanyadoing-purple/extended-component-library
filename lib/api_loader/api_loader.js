/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
var APILoader_1;
import { __decorate, __metadata } from "tslib";
import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BaseComponent } from '../base/base_component.js';
import { ATTRIBUTION_SOURCE_ID, LIBRARY_VERSION } from '../base/constants.js';
import { LoggingController } from '../base/logging_controller.js';
import { Deferred } from '../utils/deferred.js';
import inlineScript from './inline_script.js';
/** Returns a reference to `google.maps` from the global scope, if defined. */
function getGoogleMaps() {
    try {
        return google?.maps;
    }
    catch (e) {
        return undefined;
    }
}
/** Imports Web Components defined by the Maps JavaScript API. */
function loadComponentsFromMapsJS(googleMaps) {
    googleMaps.importLibrary('maps');
    googleMaps.importLibrary('marker');
}
/** Returns a `LoggingController` owned by the element, if one exists. */
function getLogger(host) {
    const logger = host.logger;
    return logger instanceof LoggingController ? logger : undefined;
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
let APILoader = APILoader_1 = class APILoader extends BaseComponent {
    constructor() {
        super(...arguments);
        /**
         * The release channel or version numbers. See the
         * [documentation](https://developers.google.com/maps/documentation/javascript/versions)
         * for more information.
         */
        this.version = 'beta';
    }
    /**
     * An alias for the `key` property. React developers should use this prop to
     * set the API key.
     */
    set apiKey(key) {
        this.key = key;
    }
    get apiKey() {
        return this.key;
    }
    async connectedCallback() {
        super.connectedCallback();
        if (APILoader_1.instance) {
            this.logger.warn('Found multiple instances of this element on the same page. ' +
                'The Google Maps JavaScript API can only be configured once; ' +
                'please ensure you only have a single instance.', this);
        }
        else {
            APILoader_1.instance = this;
        }
    }
    willUpdate(changedProperties) {
        // Do not handle updates to any duplicate API loader elements.
        if (APILoader_1.instance !== this)
            return;
        this.tryLoadGoogleMapsAPI(changedProperties);
    }
    render() {
        return html `<slot></slot>`;
    }
    getSolutionChannel() {
        if (this.solutionChannel === '')
            return undefined;
        if (!this.solutionChannel) {
            return `GMP_${ATTRIBUTION_SOURCE_ID}_extended_v${LIBRARY_VERSION}`;
        }
        return this.solutionChannel;
    }
    tryLoadGoogleMapsAPI(changedProperties) {
        if (APILoader_1.googleMapsDeferred.value) {
            if (APILoader_1.inlineScriptLoaded) {
                const changedProperty = changedProperties.keys().next().value;
                this.logger.warn(`Property '${changedProperty}' cannot be updated once the ` +
                    'Google Maps JavaScript API is already loaded.');
            }
            else {
                this.logger.warn('Please remove the <gmpx-api-loader> element if you are using ' +
                    'the Google Maps JavaScript API inline bootstrap loader. ' +
                    'Duplicate configuration may cause unexpected behavior.');
            }
        }
        else if (this.key !== undefined) {
            const { key, version, language, region, authReferrerPolicy } = this;
            const solutionChannel = this.getSolutionChannel();
            const googleMaps = inlineScript.load({
                key,
                ...(version && { v: version }),
                ...(language && { language }),
                ...(region && { region }),
                ...(solutionChannel && { solutionChannel }),
                ...(authReferrerPolicy && { authReferrerPolicy }),
            });
            APILoader_1.inlineScriptLoaded = true;
            APILoader_1.googleMapsDeferred.resolve(googleMaps);
            loadComponentsFromMapsJS(googleMaps);
        }
    }
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
    static async importLibrary(library, consumer) {
        let googleMaps = APILoader_1.googleMapsDeferred.value;
        if (!googleMaps) {
            APILoader_1.pollForGoogleMaps(
            /* numRetries= */ 5, /* interval= */ 1000, consumer && getLogger(consumer));
            googleMaps = await APILoader_1.googleMapsDeferred.promise;
        }
        return googleMaps.importLibrary(library);
    }
    /**
     * Resets API loader state and removes `google.maps` from the global scope.
     * This method should be invoked for testing purposes only.
     * @ignore
     */
    static reset() {
        delete window.google;
        delete APILoader_1.instance;
        APILoader_1.inlineScriptLoaded = false;
        APILoader_1.googleMapsDeferred = new Deferred();
    }
    /** @nocollapse */
    static pollForGoogleMaps(numRetries, interval, logger, pollCount = 0) {
        const googleMaps = getGoogleMaps();
        if (googleMaps) {
            // Display a warning if `google.maps` is not present in the global
            // namespace at first, but shows up during subsequent polling period.
            // This indicates that the developer is using the legacy script loader.
            if (!APILoader_1.inlineScriptLoaded && pollCount > 0) {
                (logger ?? console)
                    .warn('Using the legacy Google Maps JavaScript API script loader ' +
                    'may result in suboptimal performance. ' +
                    'For best results, please include a <gmpx-api-loader> ' +
                    '(https://github.com/googlemaps/extended-component-library) ' +
                    'or use the inline bootstrap loader ' +
                    '(https://goo.gle/js-api-loading) instead.');
            }
            APILoader_1.googleMapsDeferred.resolve(googleMaps);
            loadComponentsFromMapsJS(googleMaps);
        }
        else if (numRetries > 0) {
            window.setTimeout(() => {
                APILoader_1.pollForGoogleMaps(numRetries - 1, interval, logger, pollCount + 1);
            }, interval);
        }
        else {
            // Throw an error if the Maps JavaScript API is not initialized after
            // several polling attempts. This should help developers debug scenarios
            // where they forgot to include an API loader or script tag.
            let errorMessage = logger ?
                logger.formatMessage('The Google Maps JavaScript API is required for this element ' +
                    'to function correctly. ') :
                'APILoader.importLibrary(): ' +
                    'Unable to initialize the Google Maps JavaScript API. ';
            errorMessage += 'Please ensure you have a <gmpx-api-loader> on the ' +
                'page with a valid API key. ' +
                'https://github.com/googlemaps/extended-component-library';
            throw new Error(errorMessage);
        }
    }
};
/** A deferred promise that resolves to the `google.maps` object. */
APILoader.googleMapsDeferred = new Deferred();
/** Whether the inline script has been invoked by this component. */
APILoader.inlineScriptLoaded = false;
__decorate([
    property({ attribute: 'auth-referrer-policy', reflect: true, type: String }),
    __metadata("design:type", String)
], APILoader.prototype, "authReferrerPolicy", void 0);
__decorate([
    property({ reflect: true, type: String }),
    __metadata("design:type", String)
], APILoader.prototype, "key", void 0);
__decorate([
    property({ reflect: true, type: String }),
    __metadata("design:type", String)
], APILoader.prototype, "language", void 0);
__decorate([
    property({ reflect: true, type: String }),
    __metadata("design:type", String)
], APILoader.prototype, "region", void 0);
__decorate([
    property({ attribute: 'solution-channel', reflect: true, type: String }),
    __metadata("design:type", String)
], APILoader.prototype, "solutionChannel", void 0);
__decorate([
    property({ reflect: true, type: String }),
    __metadata("design:type", Object)
], APILoader.prototype, "version", void 0);
APILoader = APILoader_1 = __decorate([
    customElement('gmpx-api-loader')
], APILoader);
export { APILoader };
//# sourceMappingURL=api_loader.js.map