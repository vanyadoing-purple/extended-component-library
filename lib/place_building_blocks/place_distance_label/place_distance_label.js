/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate, __metadata } from "tslib";
import { css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { WebFont, WebFontController } from '../../base/web_font_controller.js';
import { makeWaypoint } from '../../utils/place_utils.js';
import { PlaceDataConsumer } from '../place_data_consumer.js';
import { DirectionsController } from './directions_controller.js';
function getIconNameFromTravelMode(travelMode) {
    switch (travelMode) {
        case 'bicycling':
            return 'directions_bike';
        case 'transit':
            return 'directions_subway';
        case 'walking':
            return 'directions_walk';
        default:
            return 'directions_car';
    }
}
/**
 * Converts data into a format suitable for specifying a place in the
 * `DirectionsRequest`.
 *
 * @return A `google.maps.Place` object that is identified by exactly one of
 *     Place ID, location, or query, with preference in that order.
 */
function makePlaceForDirectionsRequest(data) {
    if (!data)
        return null;
    const { placeId, location, query } = makeWaypoint(data);
    if (placeId)
        return { placeId };
    if (location)
        return { location };
    if (query)
        return { query };
    return null;
}
/**
 * Component that displays as text the distance to this place from an origin,
 * or the duration if a travel mode is also specified.
 *
 * @package Intended for template usage in the Place Overview component only.
 */
let PlaceDistanceLabel = class PlaceDistanceLabel extends PlaceDataConsumer {
    constructor() {
        super(...arguments);
        this.fontLoader = new WebFontController(this, [WebFont.MATERIAL_SYMBOLS_OUTLINED]);
        this.directionsController = new DirectionsController(this);
        this.isFetchingDirectionsData = false;
    }
    willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        // Re-fetch directions data if either origin or travel mode changes.
        if (changedProperties.has('origin') ||
            changedProperties.has('travelMode')) {
            this.updateDirectionsData();
        }
    }
    placeChangedCallback(value, oldValue) {
        // Re-fetch directions data if Place ID of the destination changes.
        if (value?.id !== oldValue?.id) {
            this.updateDirectionsData();
        }
    }
    render() {
        const { distance, duration } = this.directionsData ?? {};
        if (this.isFetchingDirectionsData || !distance)
            return html ``;
        if (!(this.travelMode && duration)) {
            return html `<span>${distance.text}</span>`;
        }
        return html `
      <span class="icon material-symbols-outlined">
        ${getIconNameFromTravelMode(this.travelMode)}
      </span>
      <span>${duration.text}</span>
    `;
    }
    /** @ignore */
    getRequiredFields() {
        return []; // Place ID alone is sufficient for a Directions request.
    }
    placeHasData() {
        return this.directionsData != null;
    }
    async updateDirectionsData() {
        if (this.isFetchingDirectionsData)
            return;
        const place = this.getPlace();
        const origin = makePlaceForDirectionsRequest(this.origin);
        const destination = makePlaceForDirectionsRequest(place);
        if (origin && destination) {
            this.isFetchingDirectionsData = true;
            const result = await this.directionsController.route({
                origin,
                destination,
                travelMode: (this.travelMode?.toUpperCase() ?? 'DRIVING'),
            });
            this.directionsData = result?.routes[0]?.legs[0];
            // When switching the travel mode between driving and undefined,
            // this.directionsData is unchanged but we still want an update.
            this.requestUpdate();
        }
        else {
            this.directionsData = undefined;
        }
        this.isFetchingDirectionsData = false;
    }
};
PlaceDistanceLabel.styles = css `
    .icon {
      font-size: inherit;
      line-height: inherit;
      vertical-align: bottom;
    }
  `;
__decorate([
    property({ attribute: 'travel-mode', reflect: true, type: String }),
    __metadata("design:type", String)
], PlaceDistanceLabel.prototype, "travelMode", void 0);
__decorate([
    property({ attribute: false }),
    __metadata("design:type", Object)
], PlaceDistanceLabel.prototype, "origin", void 0);
__decorate([
    state(),
    __metadata("design:type", Object)
], PlaceDistanceLabel.prototype, "directionsData", void 0);
PlaceDistanceLabel = __decorate([
    customElement('gmpx-place-distance-label-internal')
], PlaceDistanceLabel);
export { PlaceDistanceLabel };
//# sourceMappingURL=place_distance_label.js.map