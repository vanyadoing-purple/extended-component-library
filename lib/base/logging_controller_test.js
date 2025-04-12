/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate } from "tslib";
// import 'jasmine'; (google3-only)
import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Environment } from '../testing/environment.js';
import { LoggingController } from './logging_controller.js';
let TestLoggingControllerHost = class TestLoggingControllerHost extends LitElement {
    constructor() {
        super(...arguments);
        this.logger = new LoggingController(this);
    }
};
TestLoggingControllerHost = __decorate([
    customElement('gmpx-test-logging-controller-host')
], TestLoggingControllerHost);
describe('LoggingController', () => {
    const env = new Environment();
    async function prepareControllerHostElement() {
        const root = env.render(html `<gmpx-test-logging-controller-host></gmpx-test-logging-controller-host>`);
        const instance = root.querySelector('gmpx-test-logging-controller-host');
        if (!instance) {
            throw new Error('Failed to find gmpx-test-logging-controller-host.');
        }
        await env.waitForStability();
        return instance;
    }
    it('logs info message to console', async () => {
        const host = await prepareControllerHostElement();
        spyOn(console, 'info');
        host.logger.info('some info', host);
        expect(console.info)
            .toHaveBeenCalledOnceWith(`<gmpx-test-logging-controller-host>: some info`, host);
    });
    it('logs warning message to console', async () => {
        const host = await prepareControllerHostElement();
        spyOn(console, 'warn');
        host.logger.warn('some warning', host);
        expect(console.warn)
            .toHaveBeenCalledOnceWith(`<gmpx-test-logging-controller-host>: some warning`, host);
    });
    it('logs error message to console', async () => {
        const host = await prepareControllerHostElement();
        spyOn(console, 'error');
        host.logger.error('some error', host);
        expect(console.error)
            .toHaveBeenCalledOnceWith(`<gmpx-test-logging-controller-host>: some error`, host);
    });
});
//# sourceMappingURL=logging_controller_test.js.map