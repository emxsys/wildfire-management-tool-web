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
package com.terramenta.time;

import java.util.Calendar;
import java.util.Date;
import java.util.Observable;
import java.util.TimeZone;
import org.openide.util.lookup.ServiceProvider;

/**
 *
 * @author heidtmare
 */
//@ServiceProvider(service = DateProvider.class)
public class DateProvider extends Observable {

    //utc
    private final Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));

    /**
     * get the date
     *
     * @return
     */
    public Date getDate() {
        return calendar.getTime();
    }

    /**
     * Set date to the provided value
     *
     * @param date
     */
    public void setDate(Date date) {
        this.calendar.setTime(date);
        this.setChanged();
        this.notifyObservers(getDate());
    }

    /**
     * Add(or subtract) a time value from our date
     *
     * @param field
     * @param amount
     */
    public void add(int field, int amount) {
        calendar.add(field, amount);
        this.setChanged();
        this.notifyObservers(getDate());
    }
}
