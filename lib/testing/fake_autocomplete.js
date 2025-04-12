/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// import 'jasmine'; (google3-only)
/** Creates a Jasmine spy to replace an Autocomplete object. */
export const makeFakeAutocomplete = () => jasmine.createSpyObj('Autocomplete', ['addListener', 'bindTo', 'getBounds', 'getPlace', 'setOptions']);
//# sourceMappingURL=fake_autocomplete.js.map