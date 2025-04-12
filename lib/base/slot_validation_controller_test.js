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
import { SlotValidationController } from './slot_validation_controller.js';
let TestSlotValidationControllerHostA = class TestSlotValidationControllerHostA extends LitElement {
    constructor() {
        super(...arguments);
        this.logger = new LoggingController(this);
        this.slotValidator = new SlotValidationController(this, this.logger, ['', 'slot-a']);
    }
};
TestSlotValidationControllerHostA = __decorate([
    customElement('gmpx-test-slot-validation-controller-host-a')
], TestSlotValidationControllerHostA);
let TestSlotValidationControllerHostB = class TestSlotValidationControllerHostB extends LitElement {
    constructor() {
        super(...arguments);
        this.logger = new LoggingController(this);
        this.slotValidator = new SlotValidationController(this, this.logger, ['slot-b']);
    }
};
TestSlotValidationControllerHostB = __decorate([
    customElement('gmpx-test-slot-validation-controller-host-b')
], TestSlotValidationControllerHostB);
describe('SlotValidationController', () => {
    const env = new Environment();
    beforeEach(() => {
        spyOn(LoggingController.prototype, 'warn');
    });
    async function prepareControllerHostA(childrenHTML) {
        const root = env.render(html `
      <gmpx-test-slot-validation-controller-host-a>
        ${childrenHTML}
      </gmpx-test-slot-validation-controller-host-a>
    `);
        return root.querySelector('gmpx-test-slot-validation-controller-host-a');
    }
    async function prepareControllerHostB(childrenHTML) {
        const root = env.render(html `
      <gmpx-test-slot-validation-controller-host-b>
        ${childrenHTML}
      </gmpx-test-slot-validation-controller-host-b>
    `);
        return root.querySelector('gmpx-test-slot-validation-controller-host-b');
    }
    it('does not log warning when children are correctly slotted', async () => {
        await prepareControllerHostA(html `
      <div>child 1 in supported default slot</div>
      <div>child 2 in supported default slot</div>
      <div slot="slot-a">child in supported named slot</div>
    `);
        await prepareControllerHostB(html `
      <div slot="slot-b">child 1 in supported named slot</div>
      <div slot="slot-b">child 2 in supported named slot</div>
    `);
        expect(LoggingController.prototype.warn).not.toHaveBeenCalled();
    });
    it('does not log warning when nothing is slotted', async () => {
        await prepareControllerHostA(html ``);
        await prepareControllerHostB(html ``);
        expect(LoggingController.prototype.warn).not.toHaveBeenCalled();
    });
    it('logs warning when child is in an unsupported named slot', async () => {
        const host = await prepareControllerHostA(html `
      <div slot="slot-b">child in unsupported named slot</div>
    `);
        expect(LoggingController.prototype.warn)
            .toHaveBeenCalledOnceWith('Detected child element in unsupported "slot-b" slot. ' +
            'This component supports the following slots: default, "slot-a".', host.firstElementChild);
    });
    it('logs warning when child is in unsupported default slot', async () => {
        const host = await prepareControllerHostB(html `
      <div>child in unsupported default slot</div>
    `);
        expect(LoggingController.prototype.warn)
            .toHaveBeenCalledOnceWith('Detected child element in unsupported default slot. ' +
            'This component supports the following slots: "slot-b".', host.firstElementChild);
    });
});
//# sourceMappingURL=slot_validation_controller_test.js.map