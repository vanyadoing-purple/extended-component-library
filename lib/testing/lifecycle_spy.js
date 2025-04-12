/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** Controller that records basic information about a component's lifecycle. */
export class LifecycleSpyController {
    constructor() {
        this.hostUpdateCount = 0;
        this.hostUpdatedCount = 0;
    }
    hostUpdate() {
        this.hostUpdateCount++;
    }
    hostUpdated() {
        this.hostUpdatedCount++;
    }
}
//# sourceMappingURL=lifecycle_spy.js.map