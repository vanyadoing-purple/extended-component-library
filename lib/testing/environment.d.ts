/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/// <reference types="jasmine" />
import { TemplateResult } from 'lit';
import { FakeGoogleMapsHarness } from './fake_google_maps.js';
declare global {
    namespace jasmine {
        interface Matchers<T> {
            toHaveNormalizedText(expected: string): boolean;
        }
    }
}
/** This class manages the Jasmine test environment. */
export declare class Environment {
    importLibrarySpy?: jasmine.Spy;
    fakeGoogleMapsHarness?: FakeGoogleMapsHarness;
    private environmentRoot?;
    private readonly documentHeadChildren;
    constructor();
    /**
     * Waits for the page to become stable; including waiting for any Lit elements
     * to finish rendering and for fonts to load.
     */
    waitForStability(): Promise<void>;
    /**
     * Renders a Lit template in the environment's root container.
     *
     * @param template a Lit `TemplateResult` to render.
     * @return The root container the template was rendered to.
     */
    render(template: TemplateResult): HTMLDivElement;
    /**
     * Inserts a fake implementation of <gmp-map> into the test environment.
     */
    defineFakeMapElement(): void;
    /**
     * Inserts a fake implementation of <gmp-advanced-marker> into the test
     * environment.
     */
    defineFakeAdvancedMarkerElement(): void;
    /**
     * Waits for all Lit `ReactiveElement` children of the given parent node to
     * finish rendering.
     *
     * @param root a parent node to wait for rendering on.
     */
    private waitForLitRender;
    /**
     * Creates a root container in the document body.
     *
     * Removes any existing root if present.
     *
     * @return The new root container.
     */
    private createNewRoot;
}
