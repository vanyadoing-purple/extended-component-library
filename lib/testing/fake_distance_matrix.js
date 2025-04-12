/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export const FAKE_DM_VALUE = 101;
/**
 * Creates a fake Distance Matrix response, based on a map `fakeDistances` that
 * specifies the resulting distance for a given _destination_ point. If a
 * destination isn't found in the map, 101 is used as the distance.
 */
export function makeFakeDistanceMatrixResponse(request, fakeDistances = new Map()) {
    const rows = [];
    for (const _ of request.origins) {
        const row = [];
        for (const destination of request.destinations) {
            const fakeValue = fakeDistances.get(destination) ?? FAKE_DM_VALUE;
            const result = {
                status: 'OK',
                distance: { value: fakeValue, text: `${fakeValue} ${request.unitSystem}` }
            };
            row.push(result);
        }
        rows.push({ elements: row });
    }
    return { originAddresses: [], destinationAddresses: [], rows };
}
//# sourceMappingURL=fake_distance_matrix.js.map