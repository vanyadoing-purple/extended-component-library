/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// import 'jasmine'; (google3-only)
import { html, nothing } from 'lit';
import { Environment } from '../testing/environment.js';
import { makeFakeDistanceMatrixResponse } from '../testing/fake_distance_matrix.js';
import { FakeLatLng, FakeLatLngBounds } from '../testing/fake_lat_lng.js';
import { Deferred } from '../utils/deferred.js';
import { DistanceMeasurer } from './distances.js';
import { FeatureSet } from './interfaces.js';
import { StoreLocator } from './store_locator.js';
const LISTING_A = {
    title: 'listing A',
    addressLines: ['address A1', 'address A2'],
    position: { lat: 1, lng: 1 },
    placeId: 'placeIdA'
};
const LISTING_B = {
    title: 'listing B',
    addressLines: ['address B1', 'address B2'],
    position: { lat: 2, lng: 3 },
    placeId: 'placeIdB'
};
describe('StoreLocator', () => {
    const env = new Environment();
    beforeAll(() => {
        // Define fake implementations for <gmp-map> and <gmp-advanced-marker>.
        env.defineFakeMapElement();
        env.defineFakeAdvancedMarkerElement();
    });
    beforeEach(() => {
        DistanceMeasurer.reset();
        // Silence Lit warnings "Element <foo> scheduled an update (generally
        // because a property was set) after an update completed, causing a new
        // update to be scheduled."
        const originalWarn = console.warn;
        spyOn(console, 'warn').and.callFake((...args) => {
            if (args.length > 0 &&
                args[0].match(/^Element \S+ scheduled an update/gm)) {
                return;
            }
            originalWarn.call(console, ...args);
        });
    });
    async function prepareState(config) {
        const root = env.render(html `
      <gmpx-store-locator .listings=${config.listings} .featureSet=${config.featureSet} .mapOptions=${config.mapOptions ?? nothing}>
      </gmpx-store-locator>
    `);
        await env.waitForStability();
        const locator = root.querySelector('gmpx-store-locator');
        const locatorRoot = locator.renderRoot;
        const map = locatorRoot.querySelector('gmp-map');
        const overlayLayout = locatorRoot.querySelector('gmpx-overlay-layout');
        const placeOverview = locatorRoot.querySelector('gmpx-place-overview');
        const placePicker = locatorRoot.querySelector('gmpx-place-picker');
        const resultsList = locatorRoot.querySelector('#location-results-list');
        const sectionName = locatorRoot.querySelector('.section-name');
        return {
            locator,
            locatorRoot,
            map,
            overlayLayout,
            placeOverview,
            placePicker,
            resultsList,
            sectionName,
        };
    }
    it('is defined', () => {
        const el = document.createElement('gmpx-store-locator');
        expect(el).toBeInstanceOf(StoreLocator);
    });
    it('renders only the font loader until initialized with async dependencies', async () => {
        const libraryImport = new Deferred();
        env.importLibrarySpy.and.returnValue(libraryImport.promise);
        const { locatorRoot } = await prepareState({ featureSet: FeatureSet.ADVANCED });
        expect([...locatorRoot.children].map(x => x.tagName)).toEqual(['LINK']);
    });
    it('updates the map bounds for the specified listings', async () => {
        const { map } = await prepareState({ listings: [LISTING_A, LISTING_B], featureSet: FeatureSet.ADVANCED });
        expect(map?.innerMap?.fitBounds)
            .toHaveBeenCalledOnceWith(new FakeLatLngBounds({ north: 2, south: 1, east: 3, west: 1 }));
    });
    it('pans the map when a list item is selected', async () => {
        const { map, resultsList } = await prepareState({ listings: [LISTING_A, LISTING_B], featureSet: FeatureSet.ADVANCED });
        resultsList.children[0].click();
        await env.waitForStability();
        expect(map?.innerMap?.panTo).toHaveBeenCalledOnceWith(LISTING_A.position);
    });
    it('sets default map options if none are specified', async () => {
        const { map } = await prepareState({ listings: [LISTING_A], featureSet: FeatureSet.BASIC });
        expect(map?.innerMap?.setOptions).toHaveBeenCalledWith({
            mapTypeControl: false,
            maxZoom: 17,
            streetViewControl: false,
        });
    });
    it('sets map options when specified', async () => {
        const { map } = await prepareState({
            listings: [LISTING_A, LISTING_B],
            featureSet: FeatureSet.ADVANCED,
            mapOptions: { zoom: 10 }
        });
        expect(map?.innerMap?.setOptions).toHaveBeenCalledWith({
            zoom: 10,
        });
    });
    it('initially displays locations in their original order', async () => {
        const { resultsList, sectionName } = await prepareState({ listings: [LISTING_A, LISTING_B], featureSet: FeatureSet.ADVANCED });
        expect(sectionName.textContent).toContain('All locations (2)');
        const items = resultsList.children;
        expect(items[0].textContent).toContain(LISTING_A.addressLines[0]);
    });
    it('does not show a search input in basic mode', async () => {
        const { placePicker } = await prepareState({ listings: [LISTING_A, LISTING_B], featureSet: FeatureSet.BASIC });
        expect(placePicker).toBeNull();
    });
    it('sorts locations by travel distance and updates map bounds when a user location is entered', async () => {
        const origin = new FakeLatLng(10, 10);
        const { placePicker, map, resultsList, sectionName } = await prepareState({ listings: [LISTING_A, LISTING_B], featureSet: FeatureSet.ADVANCED });
        map?.innerMap.fitBounds.calls.reset();
        spyOnProperty(placePicker, 'value').and.returnValue({
            id: 'foo_origin_id',
            location: origin,
            addressComponents: [{
                    types: ['foo', 'country'],
                    shortText: 'US',
                    longText: 'United States'
                }],
        });
        // Distance Matrix will set Location B as closer
        const distanceMap = new Map();
        distanceMap.set(LISTING_A.position, 20.8);
        distanceMap.set(LISTING_B.position, 20.7);
        env.fakeGoogleMapsHarness.distanceMatrixHandler = (request) => makeFakeDistanceMatrixResponse(request, distanceMap);
        const distanceMatrixSpy = spyOn(env.fakeGoogleMapsHarness, 'distanceMatrixHandler')
            .and.callThrough();
        placePicker?.dispatchEvent(new Event('gmpx-placechange'));
        await env.waitForStability();
        expect(distanceMatrixSpy).toHaveBeenCalledOnceWith({
            origins: [origin],
            destinations: [LISTING_A.position, LISTING_B.position],
            unitSystem: 0,
            travelMode: 'DRIVING',
        });
        expect(map?.innerMap?.fitBounds)
            .toHaveBeenCalledOnceWith(new FakeLatLngBounds({ north: 10, south: 1, east: 10, west: 1 }));
        expect(sectionName?.textContent).toContain('Nearest locations (2)');
        const items = resultsList.children;
        expect(items[0].textContent).toContain(LISTING_B.addressLines[0]);
        expect(items[0].querySelector('.distance')?.textContent)
            .toContain('20.7 0');
    });
    it('shows non-US travel distances in metric', async () => {
        const { placePicker, map, resultsList } = await prepareState({ listings: [LISTING_A, LISTING_B], featureSet: FeatureSet.ADVANCED });
        map?.innerMap.fitBounds.calls.reset();
        spyOnProperty(placePicker, 'value').and.returnValue({
            id: 'foo_origin_id',
            location: new FakeLatLng(10, 10),
            addressComponents: [{ types: ['foo', 'country'], shortText: 'CA', longText: 'Canada' }],
        });
        // Distance Matrix will set Location B as closer
        const distanceMap = new Map();
        distanceMap.set(LISTING_A.position, 20.8);
        distanceMap.set(LISTING_B.position, 20.7);
        env.fakeGoogleMapsHarness.distanceMatrixHandler = (request) => makeFakeDistanceMatrixResponse(request, distanceMap);
        spyOn(env.fakeGoogleMapsHarness, 'distanceMatrixHandler')
            .and.callThrough();
        placePicker?.dispatchEvent(new Event('gmpx-placechange'));
        await env.waitForStability();
        // Fake Distance Matrix returns "{distance} {units}", with units indicating
        // the requested value. 0 = imperial, 1 = metric per the Maps JS enum.
        expect(resultsList.children[0].querySelector('.distance')?.textContent)
            .toContain('20.7 1');
    });
    it('shows place details', async () => {
        const { resultsList, placeOverview, overlayLayout } = await prepareState({ listings: [LISTING_A, LISTING_B], featureSet: FeatureSet.ADVANCED });
        const items = resultsList.children;
        spyOn(overlayLayout, 'showOverlay').and.callThrough();
        items[1].querySelector('.view-details').click();
        await env.waitForStability();
        expect(overlayLayout?.showOverlay).toHaveBeenCalled();
        expect(placeOverview?.place).toEqual(LISTING_B.placeId);
    });
    it('hides place details', async () => {
        const { resultsList, overlayLayout, locatorRoot } = await prepareState({ listings: [LISTING_A, LISTING_B], featureSet: FeatureSet.ADVANCED });
        const items = resultsList.children;
        spyOn(overlayLayout, 'hideOverlay').and.callThrough();
        items[1].querySelector('.view-details').click();
        await env.waitForStability();
        locatorRoot.querySelector('.back-button').click();
        await env.waitForStability();
        expect(overlayLayout?.hideOverlay).toHaveBeenCalled();
    });
});
//# sourceMappingURL=store_locator_test.js.map