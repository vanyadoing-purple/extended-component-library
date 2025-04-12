/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import { ReactiveController } from 'lit';
/** Controller that records basic information about a component's lifecycle. */
export declare class LifecycleSpyController implements ReactiveController {
    hostUpdateCount: number;
    hostUpdatedCount: number;
    hostUpdate(): void;
    hostUpdated(): void;
}
