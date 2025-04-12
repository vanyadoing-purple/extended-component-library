/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// import 'jasmine'; (google3-only)
import { RequestCache } from './request_cache.js';
const FAKE_REQUEST = {
    id: 'xHD87228BCE8',
    values: [3, 5, 8, 2, 7, 8],
    location: '123 Place St',
    deliveryEnabled: true,
    distance: 105.5,
    inventory: { 'D': 35, 'A': 10, 'C': 5, 'B': 20 },
};
const SORTED_REQUEST = {
    deliveryEnabled: true,
    distance: 105.5,
    id: 'xHD87228BCE8',
    inventory: { 'A': 10, 'B': 20, 'C': 5, 'D': 35 },
    location: '123 Place St',
    values: [3, 5, 8, 2, 7, 8],
};
const FAKE_RESPONSE = {
    id: 'xHD87228BCE8',
    cost: 110.75,
    delivered: true,
    status: 'OK',
};
const FAKE_RESPONSE_2 = {
    id: 'xHD87228BCE8',
    cost: 110.75,
    delivered: false,
    status: 'UNKNOWN',
};
describe('RequestCache', () => {
    it('returns null when no request exists', async () => {
        const requestCache = new RequestCache(10, () => false);
        const result = requestCache.get(FAKE_REQUEST);
        expect(result).toBeNull();
    });
    it('returns the existing result when one exists', async () => {
        const requestCache = new RequestCache(10, () => false);
        requestCache.set(FAKE_REQUEST, Promise.resolve(FAKE_RESPONSE));
        const result = await requestCache.get(FAKE_REQUEST);
        expect(result).toEqual(FAKE_RESPONSE);
    });
    it('updates result if request already exists', async () => {
        const requestCache = new RequestCache(10, () => false);
        requestCache.set(FAKE_REQUEST, Promise.resolve(FAKE_RESPONSE));
        requestCache.set(FAKE_REQUEST, Promise.resolve(FAKE_RESPONSE_2));
        const result = await requestCache.get(FAKE_REQUEST);
        expect(result).toEqual(FAKE_RESPONSE_2);
    });
    it('deletes request if it should be retried', async () => {
        const requestCache = new RequestCache(10, () => true);
        requestCache.set(FAKE_REQUEST, Promise.reject(new Error()));
        await 0;
        const result = await requestCache.get(FAKE_REQUEST);
        expect(result).toBeNull();
    });
    it('treats requests the same regardless of property order', async () => {
        const requestCache = new RequestCache(10, () => false);
        requestCache.set(FAKE_REQUEST, Promise.resolve(FAKE_RESPONSE));
        const result = await requestCache.get(SORTED_REQUEST);
        expect(result).toEqual(FAKE_RESPONSE);
    });
});
//# sourceMappingURL=request_cache_test.js.map