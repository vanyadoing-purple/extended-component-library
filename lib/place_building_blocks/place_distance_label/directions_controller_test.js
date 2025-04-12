/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
// import 'jasmine'; (google3-only)
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Environment } from '../../testing/environment.js';
import { DirectionsController } from './directions_controller.js';
const FAKE_REQUEST = {
    origin: { lat: 37.77, lng: -122.447 },
    destination: { lat: 37.768, lng: -122.511 },
    travelMode: 'DRIVING',
};
let TestDirectionsControllerHost = class TestDirectionsControllerHost extends LitElement {
    constructor() {
        super(...arguments);
        this.directionsController = new DirectionsController(this);
    }
};
TestDirectionsControllerHost = __decorate([
    customElement('gmpx-test-directions-controller-host')
], TestDirectionsControllerHost);
describe('DirectionsController', () => {
    const env = new Environment();
    async function prepareControllerHostElement() {
        const root = env.render(html `
      <gmpx-test-directions-controller-host>
      </gmpx-test-directions-controller-host>
    `);
        const host = root.querySelector('gmpx-test-directions-controller-host');
        if (!host) {
            throw new Error('Failed to find gmpx-test-directions-controller-host.');
        }
        await env.waitForStability();
        return host;
    }
    afterEach(() => {
        DirectionsController.reset();
    });
    const parameters = [
        {
            error: {
                code: 'UNKNOWN_ERROR',
                endpoint: 'DIRECTIONS_ROUTE',
                name: 'MapsRequestError',
                message: 'A directions request could not be processed due to a server error.',
            }
        },
        {
            error: {
                code: 'OVER_QUERY_LIMIT',
                endpoint: 'DIRECTIONS_ROUTE',
                name: 'MapsRequestError',
                message: 'The webpage is not allowed to use the directions service',
            }
        }
    ];
    parameters.forEach(({ error }) => {
        it(`retries failed request due to transient error: ${error.code}`, async () => {
            const host = await prepareControllerHostElement();
            const routesSpy = spyOn(env.fakeGoogleMapsHarness, 'routeHandler')
                .and.rejectWith(error);
            await host.directionsController.route(FAKE_REQUEST);
            await host.directionsController.route(FAKE_REQUEST);
            await env.waitForStability();
            expect(routesSpy).toHaveBeenCalledTimes(2);
        });
    });
    it('does not retry failed request due to non transient error', async () => {
        const host = await prepareControllerHostElement();
        const error = {
            code: 'INVALID_REQUEST',
            endpoint: 'DIRECTIONS_ROUTE',
            name: 'MapsRequestError',
            message: 'The webpage is not allowed to use the directions service'
        };
        const routesSpy = spyOn(env.fakeGoogleMapsHarness, 'routeHandler').and.rejectWith(error);
        await host.directionsController.route(FAKE_REQUEST);
        await host.directionsController.route(FAKE_REQUEST);
        await env.waitForStability();
        expect(routesSpy).toHaveBeenCalledTimes(1);
    });
});
//# sourceMappingURL=directions_controller_test.js.map