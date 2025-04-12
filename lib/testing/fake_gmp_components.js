/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { LitElement } from 'lit';
/** A fake `google.maps.MapElement` class for testing purposes. */
export class FakeMapElement extends LitElement {
    constructor() {
        super(...arguments);
        this.center = null;
        this.innerMap = jasmine.createSpyObj('Map', ['fitBounds', 'panTo', 'setOptions']);
        this.mapId = null;
        this.zoom = null;
    }
}
/**
 * A fake `google.maps.AdvancedMarkerElement` class for testing purposes.
 */
export class FakeAdvancedMarkerElement extends LitElement {
    constructor() {
        super(...arguments);
        this.title = '';
    }
    set content(content) {
        // Detach from the DOM as in the real AdvancedMarkerElement
        content?.remove();
        this.innerContent = content;
    }
    get content() {
        return this.innerContent;
    }
}
//# sourceMappingURL=fake_gmp_components.js.map