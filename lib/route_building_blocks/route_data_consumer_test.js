/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate, __metadata } from "tslib";
import '../place_building_blocks/place_data_provider/place_data_provider_test.js';
// import 'jasmine'; (google3-only)
import { provide } from '@lit/context';
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Environment } from '../testing/environment.js';
import { makeFakeRoute } from '../testing/fake_route.js';
import { routeContext, RouteDataConsumer } from './route_data_consumer.js';
let TestRouteDataConsumer = class TestRouteDataConsumer extends RouteDataConsumer {
    getRoutePublic() {
        return this.getRoute();
    }
};
TestRouteDataConsumer = __decorate([
    customElement('gmpx-test-route-data-consumer')
], TestRouteDataConsumer);
let FakeRouteDataProvider = class FakeRouteDataProvider extends LitElement {
};
__decorate([
    provide({ context: routeContext }),
    property({ attribute: false }),
    __metadata("design:type", Object)
], FakeRouteDataProvider.prototype, "contextRoute", void 0);
FakeRouteDataProvider = __decorate([
    customElement('gmpx-fake-route-data-provider')
], FakeRouteDataProvider);
describe('RouteDataConsumer', () => {
    const env = new Environment();
    async function prepareState() {
        const root = env.render(html `
      <gmpx-fake-route-data-provider>
        <gmpx-test-route-data-consumer>
        </gmpx-test-route-data-consumer>
      </gmpx-fake-route-data-provider>
    `);
        await env.waitForStability();
        const provider = root.querySelector('gmpx-fake-route-data-provider');
        const consumer = root.querySelector('gmpx-test-route-data-consumer');
        return { provider, consumer };
    }
    it('has its route undefined by default', () => {
        const consumer = new TestRouteDataConsumer();
        expect(consumer.getRoutePublic()).toBeUndefined();
    });
    it('gets a route from its property', () => {
        const consumer = new TestRouteDataConsumer();
        const route = makeFakeRoute();
        consumer.route = route;
        expect(consumer.getRoutePublic()).toBe(route);
    });
    it('gets a route from context', async () => {
        const { provider, consumer } = await prepareState();
        const route = makeFakeRoute();
        provider.contextRoute = route;
        expect(consumer.getRoutePublic()).toBe(route);
    });
    it('prioritizes the route from its property', async () => {
        const { provider, consumer } = await prepareState();
        const providerRoute = makeFakeRoute();
        const consumerRoute = makeFakeRoute();
        provider.contextRoute = providerRoute;
        consumer.route = consumerRoute;
        expect(consumer.getRoutePublic()).toBe(consumerRoute);
    });
});
//# sourceMappingURL=route_data_consumer_test.js.map