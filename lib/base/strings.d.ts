/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
export type StringFunction = (...args: any[]) => string;
/**
 * Translatable string literals used in one or more components of this library,
 * each keyed by a unique string ID in CONSTANT_CASE.
 *
 * The values of this interface may be either plain strings or string functions,
 * the latter of which outputs a string based on one or more string parameters.
 *
 * Naming convention is <COMPONENT>_<DESCRIPTION>, where the first term
 * indicates where the string is used and the second term describes its intent.
 */
export declare interface StringLiterals extends Record<string, string | StringFunction> {
    LOCATOR_BACK_BUTTON_CTA: string;
    LOCATOR_DIRECTIONS_BUTTON_LABEL: (destination: string) => string;
    LOCATOR_LIST_HEADER: string;
    LOCATOR_LIST_SUBHEADING: string;
    LOCATOR_LIST_SUBHEADING_WITH_SEARCH: string;
    LOCATOR_SEARCH_LOCATION_MARKER_TITLE: string;
    LOCATOR_SEARCH_PROMPT: string;
    LOCATOR_VIEW_DETAILS_CTA: string;
    PLACE_CLEAR_ARIA_LABEL: string;
    PLACE_CLOSED: string;
    PLACE_CLOSED_PERMANENTLY: string;
    PLACE_CLOSED_TEMPORARILY: string;
    PLACE_CLOSES: (closingTime: string) => string;
    PLACE_HAS_DELIVERY: string;
    PLACE_HAS_DINE_IN: string;
    PLACE_HAS_TAKEOUT: string;
    PLACE_NO_DELIVERY: string;
    PLACE_NO_DINE_IN: string;
    PLACE_NO_TAKEOUT: string;
    PLACE_OPEN_ALWAYS: string;
    PLACE_OPEN_NOW: string;
    PLACE_OPENING_HOURS_DEFAULT_SUMMARY: string;
    PLACE_OPENING_HOURS_ARIA_LABEL: string;
    PLACE_OPENS: (openingTime: string) => string;
    PLACE_OPERATIONAL: string;
    PLACE_PHOTO_ALT: (placeName: string) => string;
    PLACE_PHOTO_ATTRIBUTION_PREFIX: string;
    PLACE_PHOTO_BACK_ARIA_LABEL: string;
    PLACE_PHOTO_NEXT_ARIA_LABEL: string;
    PLACE_PHOTO_PREV_ARIA_LABEL: string;
    /** ARIA label for the `i`-th photo tile, where `i` is 1-based. */
    PLACE_PHOTO_TILE_ARIA_LABEL: (i: number) => string;
    PLACE_RATING_ARIA_LABEL: (rating: number | string) => string;
    PLACE_REVIEWS_AUTHOR_PHOTO_ALT: (author: string) => string;
    PLACE_REVIEWS_MORE: string;
    PLACE_REVIEWS_SECTION_CAPTION: string;
    PLACE_REVIEWS_SECTION_HEADING: string;
    PLACE_SEARCH_ARIA_LABEL: string;
    /** Formats a place type value from the Places API for display. */
    PLACE_TYPE: (placeType: string) => string;
}
/**
 * String literals in the `en-US` locale.
 */
export declare const STRING_LITERALS_EN_US: StringLiterals;
