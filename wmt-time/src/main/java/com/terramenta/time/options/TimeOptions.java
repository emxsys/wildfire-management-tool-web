/*
 * Copyright © 2014, Terramenta. All rights reserved.
 *
 * This work is subject to the terms of either
 * the GNU General Public License Version 3 ("GPL") or 
 * the Common Development and Distribution License("CDDL") (collectively, the "License").
 * You may not use this work except in compliance with the License.
 * 
 * You can obtain a copy of the License at
 * http://opensource.org/licenses/CDDL-1.0
 * http://opensource.org/licenses/GPL-3.0
 */
package com.terramenta.time.options;

import java.util.Locale;
import java.util.TimeZone;
import java.util.prefs.Preferences;
import org.openide.util.NbPreferences;

/**
 * Time Options
 *
 * @author Chris.Heidt
 * @author Bruce Schubert (revisions)
 */
public class TimeOptions {

    public static final String PROP_TIMEZONE = "tm.time.timezone";
    public static final String PROP_LOCALE = "tm.time.locale";
    public static final String PROP_FORMAT = "tm.time.format";

    public static final String DEFAULT_TIMEZONE = TimeZone.getDefault().getID();
    public static final String DEFAULT_LOCALE = Locale.getDefault().toLanguageTag();
    public static final String DEFAULT_FORMAT = "yyyy/MM/dd HH:mm:ss z";

    private static final Preferences prefs = NbPreferences.forModule(TimeOptions.class);

    public static final TimeZone getTimeZone() {
        return TimeZone.getTimeZone(prefs.get(PROP_TIMEZONE, DEFAULT_TIMEZONE));
    }

    public static final Locale getTimeLocale() {
        return Locale.forLanguageTag(
                prefs.get(TimeOptions.PROP_LOCALE, TimeOptions.DEFAULT_LOCALE));
    }

    public static final String getTimeFormat() {
        return prefs.get(PROP_FORMAT, DEFAULT_FORMAT);
    }

}
