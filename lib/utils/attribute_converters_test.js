/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { __decorate, __metadata } from "tslib";
import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { Environment } from '../testing/environment.js';
import { LAT_LNG_LITERAL_ATTRIBUTE_CONVERTER, STRING_ARRAY_ATTRIBUTE_CONVERTER } from './attribute_converters.js';
describe('LAT_LNG_LITERAL_ATTRIBUTE_CONVERTER', () => {
    const env = new Environment();
    let TestLatLngAttrConverter = class TestLatLngAttrConverter extends LitElement {
    };
    __decorate([
        property({
            converter: LAT_LNG_LITERAL_ATTRIBUTE_CONVERTER,
            reflect: true,
        }),
        __metadata("design:type", Object)
    ], TestLatLngAttrConverter.prototype, "testprop", void 0);
    TestLatLngAttrConverter = __decorate([
        customElement('gmpx-test-lat-lng-attr-converter')
    ], TestLatLngAttrConverter);
    async function prepareState(attrValue) {
        const root = env.render(html `
      <gmpx-test-lat-lng-attr-converter testprop=${ifDefined(attrValue)}>
      </gmpx-test-lat-lng-attr-converter>
    `);
        await env.waitForStability();
        return root.querySelector('gmpx-test-lat-lng-attr-converter');
    }
    const attrsToProps = [
        { attr: '12.34,-56.78', prop: { lat: 12.34, lng: -56.78 } },
        { attr: '  12.34,  -56.78  ', prop: { lat: 12.34, lng: -56.78 } },
        { attr: '12.34,-56.78,9', prop: { lat: 12.34, lng: -56.78 } },
        { attr: '', prop: { lat: 0, lng: 0 } },
        { attr: 'invalid value', prop: { lat: 0, lng: 0 } },
        { attr: '12.34', prop: { lat: 12.34, lng: 0 } },
        { attr: ',-56.78', prop: { lat: 0, lng: -56.78 } },
    ];
    attrsToProps.forEach(({ attr, prop }) => {
        it(`converts attribute "${attr}" to property`, async () => {
            const el = await prepareState(attr);
            expect(el.testprop).toEqual(prop);
        });
    });
    it('sets property to undefined when attribute is removed', async () => {
        const el = await prepareState('12.34,-56.78');
        el.removeAttribute('testprop');
        expect(el.testprop).toBeUndefined();
    });
    it('converts property to attribute', async () => {
        const el = await prepareState();
        el.testprop = { lat: 12.34, lng: -56.78 };
        await env.waitForStability();
        expect(el.getAttribute('testprop')).toBe('12.34,-56.78');
    });
    it('removes attribute when property is set to undefined', async () => {
        const el = await prepareState('12.34,-56.78');
        el.testprop = undefined;
        await env.waitForStability();
        expect(el.hasAttribute('testprop')).toBeFalse();
    });
});
describe('STRING_ARRAY_ATTRIBUTE_CONVERTER', () => {
    const env = new Environment();
    let TestStringArrayAttrConverter = class TestStringArrayAttrConverter extends LitElement {
    };
    __decorate([
        property({
            converter: STRING_ARRAY_ATTRIBUTE_CONVERTER,
            reflect: true,
        }),
        __metadata("design:type", Array)
    ], TestStringArrayAttrConverter.prototype, "testprop", void 0);
    TestStringArrayAttrConverter = __decorate([
        customElement('gmpx-test-string-array-attr-converter')
    ], TestStringArrayAttrConverter);
    async function prepareState(attrValue) {
        const root = env.render(html `
      <gmpx-test-string-array-attr-converter testprop=${ifDefined(attrValue)}>
      </gmpx-test-string-array-attr-converter>
    `);
        await env.waitForStability();
        return root.querySelector('gmpx-test-string-array-attr-converter');
    }
    const attrsToProps = [
        { attr: '', prop: [] },
        { attr: 'foo', prop: ['foo'] },
        { attr: 'foo bar baz', prop: ['foo', 'bar', 'baz'] },
        { attr: '  foo  bar  ', prop: ['foo', 'bar'] },
    ];
    attrsToProps.forEach(({ attr, prop }) => {
        it(`converts attribute "${attr}" to property`, async () => {
            const el = await prepareState(attr);
            expect(el.testprop).toEqual(prop);
        });
    });
    it('sets property to undefined when attribute is removed', async () => {
        const el = await prepareState('foo');
        el.removeAttribute('testprop');
        expect(el.testprop).toBeUndefined();
    });
    const propsToAttrs = [
        { prop: [], attr: '' },
        { prop: ['foo'], attr: 'foo' },
        { prop: ['foo', 'bar', 'baz'], attr: 'foo bar baz' },
    ];
    propsToAttrs.forEach(({ prop, attr }) => {
        it(`converts property [${prop}] to attribute`, async () => {
            const el = await prepareState(attr);
            expect(el.getAttribute('testprop')).toBe(attr);
        });
    });
    it('removes attribute when property is set to undefined', async () => {
        const el = await prepareState('foo');
        el.testprop = undefined;
        await env.waitForStability();
        expect(el.hasAttribute('testprop')).toBeFalse();
    });
});
//# sourceMappingURL=attribute_converters_test.js.map