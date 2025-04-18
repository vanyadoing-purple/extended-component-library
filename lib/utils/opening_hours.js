/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;
const ONE_WEEK_IN_MS = 7 * ONE_DAY_IN_MS;
/**
 * Formats a relative point in time according to the browser's locale format.
 */
function formatPointTime(point, includeWeekday = false) {
    // Choose an arbitrary `Date`, then set the fields needed for formatting
    // (weekday and time).
    const date = new Date();
    date.setDate(date.getDate() - date.getDay() + point.day);
    date.setHours(point.hour);
    date.setMinutes(point.minute);
    date.setSeconds(0);
    return date.toLocaleString(
    /* locales= */ undefined, {
        hour: 'numeric',
        minute: 'numeric',
        weekday: includeWeekday ? 'short' : undefined
    });
}
/**
 * Formats a relative point in time (specified in the Place's TZ), usually
 * including the weekday. However, if the point in time, as an absolute
 * timestamp, occurs within the next 24 hours, hide the weekday.
 *
 * @param point The relative time from the Places API (weekday, hour, minute)
 * @param absolutePoint The instant in time corresponding to `point`, i.e. a
 *     `Date` object
 * @param now Used to determine if `absolutePoint` is coming soon
 */
export function formatTimeWithWeekdayMaybe(point, absolutePoint, now = new Date()) {
    return formatPointTime(point, !isSoon(absolutePoint, now));
}
/**
 * Returns whether the given date is in the future and soon approaching. "Soon"
 * means sooner than the `intervalMs` argument (default 24 hours).
 */
export function isSoon(date, now = new Date(), intervalMs = ONE_DAY_IN_MS) {
    return ((date >= now) && ((date.valueOf() - now.valueOf()) < intervalMs));
}
/** Detects if a Place is declared as always open. */
function isPlaceAlwaysOpen(openingHours) {
    return ((openingHours.periods?.length === 1) && !openingHours.periods[0].close &&
        (openingHours.periods[0].open.day === 0) &&
        (openingHours.periods[0].open.hour === 0) &&
        (openingHours.periods[0].open.minute === 0));
}
/** Gets the date components of the most recent Sunday (relative to UTC). */
function getLastSundayUTC(date) {
    const sundayUTC = new Date(date);
    sundayUTC.setUTCDate(sundayUTC.getUTCDate() - sundayUTC.getUTCDay());
    return {
        year: sundayUTC.getUTCFullYear(),
        month: sundayUTC.getUTCMonth(),
        day: sundayUTC.getUTCDate(),
    };
}
/**
 * From all occurrences of "Sunday at 00:00" in the Place's timezone, return
 * the most recent one prior to `now`.
 */
function getLastSundayInPlaceTimezone(now, utcOffsetMinutes) {
    const { year, month, day } = getLastSundayUTC(now);
    let placeSundayStart = Date.UTC(year, month, day, 0, -utcOffsetMinutes);
    // Because of the offset, `placeSundayStart` could be after `now` or more
    // than 7 days before it. Increment as necessary.
    const deltaBeforeNowMs = now.valueOf() - placeSundayStart;
    if (deltaBeforeNowMs < 0) {
        placeSundayStart -= ONE_WEEK_IN_MS;
    }
    else if (deltaBeforeNowMs >= ONE_WEEK_IN_MS) {
        placeSundayStart += ONE_WEEK_IN_MS;
    }
    return new Date(placeSundayStart);
}
/**
 * Converts a relative `OpeningHoursPoint` object into an absolute timestamp,
 * indexed off of `placeSundayStart`.
 */
function getPointDate(point, placeSundayStart) {
    const pointDate = new Date(placeSundayStart);
    pointDate.setDate(pointDate.getDate() + point.day);
    pointDate.setHours(pointDate.getHours() + point.hour);
    pointDate.setMinutes(pointDate.getMinutes() + point.minute);
    return pointDate;
}
/**
 * Finds the currently active Opening Hours Period, if any, along with its
 * absolute open and closing timestamps.
 */
function getCurrentPeriod(openingHours, utcOffsetMinutes, now = new Date()) {
    const lastSundayStart = getLastSundayInPlaceTimezone(now, utcOffsetMinutes);
    for (const period of openingHours.periods) {
        const stats = {
            period,
            openDate: getPointDate(period.open, lastSundayStart),
            closeDate: period.close ? getPointDate(period.close, lastSundayStart) :
                undefined
        };
        if (!stats.closeDate) {
            return stats;
        }
        // In situations where the local close time appears earlier than the open
        // time, e.g. "Opens Saturday (6), closes Sunday (0)", create a forward
        // interval.
        if (stats.closeDate < stats.openDate) {
            if (stats.openDate > now) {
                stats.openDate.setDate(stats.openDate.getDate() - 7);
            }
            else {
                stats.closeDate.setDate(stats.closeDate.getDate() + 7);
            }
        }
        if ((now >= stats.openDate) && (now < stats.closeDate)) {
            return stats;
        }
    }
    return {};
}
/** Status indicator for an upcoming close time. */
export var NextCloseTimeStatus;
(function (NextCloseTimeStatus) {
    NextCloseTimeStatus[NextCloseTimeStatus["UNKNOWN"] = 0] = "UNKNOWN";
    NextCloseTimeStatus[NextCloseTimeStatus["ALWAYS_OPEN"] = 1] = "ALWAYS_OPEN";
    NextCloseTimeStatus[NextCloseTimeStatus["NOT_OPEN_NOW"] = 2] = "NOT_OPEN_NOW";
    NextCloseTimeStatus[NextCloseTimeStatus["WILL_CLOSE"] = 3] = "WILL_CLOSE";
})(NextCloseTimeStatus || (NextCloseTimeStatus = {}));
/**
 * Finds the next closing time of a Place, returning it (if present) and a
 * status flag.
 *
 * Does not take into account exceptional hours (such as holidays) or business
 * status.
 */
export function getUpcomingCloseTime(place, now = new Date()) {
    if (!place.regularOpeningHours || place.utcOffsetMinutes == null) {
        return { status: NextCloseTimeStatus.UNKNOWN };
    }
    else if (isPlaceAlwaysOpen(place.regularOpeningHours)) {
        return { status: NextCloseTimeStatus.ALWAYS_OPEN };
    }
    const currentPeriod = getCurrentPeriod(place.regularOpeningHours, place.utcOffsetMinutes, now);
    if (!currentPeriod.period) {
        return { status: NextCloseTimeStatus.NOT_OPEN_NOW };
    }
    else if (!currentPeriod.closeDate) {
        // This should not happen unless we receive malformed data; "always open"
        // should be caught by the `isPlaceAlwaysOpen()` check above.
        return { status: NextCloseTimeStatus.ALWAYS_OPEN };
    }
    return {
        status: NextCloseTimeStatus.WILL_CLOSE,
        closeDate: currentPeriod.closeDate,
        // Always defined if `currentPeriod.closeDate` is
        closePoint: currentPeriod.period.close,
    };
}
/** Status indicator for an upcoming opening time. */
export var NextOpenTimeStatus;
(function (NextOpenTimeStatus) {
    NextOpenTimeStatus[NextOpenTimeStatus["UNKNOWN"] = 0] = "UNKNOWN";
    NextOpenTimeStatus[NextOpenTimeStatus["NEVER_OPEN"] = 1] = "NEVER_OPEN";
    NextOpenTimeStatus[NextOpenTimeStatus["ALREADY_OPEN"] = 2] = "ALREADY_OPEN";
    NextOpenTimeStatus[NextOpenTimeStatus["WILL_OPEN"] = 3] = "WILL_OPEN";
})(NextOpenTimeStatus || (NextOpenTimeStatus = {}));
/**
 * Finds the next open time of a Place, returning it (if present) and a
 * status flag.
 *
 * Does not take into account exceptional hours (such as holidays) or business
 * status.
 */
export function getUpcomingOpenTime(place, now = new Date()) {
    if (!place.regularOpeningHours || place.utcOffsetMinutes == null) {
        return { status: NextOpenTimeStatus.UNKNOWN };
    }
    else if (isPlaceAlwaysOpen(place.regularOpeningHours)) {
        return { status: NextOpenTimeStatus.ALREADY_OPEN };
    }
    const lastSundayStart = getLastSundayInPlaceTimezone(now, place.utcOffsetMinutes);
    const bestResult = {
        status: NextOpenTimeStatus.NEVER_OPEN,
    };
    let closestOpenInterval = Infinity;
    for (const period of place.regularOpeningHours.periods) {
        const openDate = getPointDate(period.open, lastSundayStart);
        if (!period.close) {
            return { status: NextOpenTimeStatus.ALREADY_OPEN };
        }
        const closeDate = getPointDate(period.close, lastSundayStart);
        if ((closeDate >= openDate) && (now >= openDate) && (now < closeDate)) {
            return { status: NextOpenTimeStatus.ALREADY_OPEN };
        }
        else if ((closeDate < openDate) && !((now >= closeDate) && (now < openDate))) {
            return { status: NextOpenTimeStatus.ALREADY_OPEN };
        }
        // Make sure openDate is in the future
        if (openDate < now) {
            openDate.setDate(openDate.getDate() + 7);
        }
        const interval = openDate.valueOf() - now.valueOf();
        if (interval < closestOpenInterval) {
            closestOpenInterval = interval;
            bestResult.status = NextOpenTimeStatus.WILL_OPEN;
            bestResult.openPoint = period.open;
            bestResult.openDate = openDate;
        }
    }
    return bestResult;
}
/**
 * Temporary (until Place is GA) replacement for the built-in isOpen() method.
 */
export function isOpen(place, now = new Date()) {
    if (!place.regularOpeningHours || place.utcOffsetMinutes == null) {
        return undefined;
    }
    else if (isPlaceAlwaysOpen(place.regularOpeningHours)) {
        return true;
    }
    const { period } = getCurrentPeriod(place.regularOpeningHours, place.utcOffsetMinutes, now);
    return !!period;
}
//# sourceMappingURL=opening_hours.js.map