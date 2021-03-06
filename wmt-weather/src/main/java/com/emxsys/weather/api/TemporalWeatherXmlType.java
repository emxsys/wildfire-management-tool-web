/*
 * Copyright (c) 2015, Bruce Schubert <bruce@emxsys.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     - Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     - Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *
 *     - Neither the name of Bruce Schubert, Emxsys nor the names of its 
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
package com.emxsys.weather.api;

import com.emxsys.visad.Times;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Set;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import visad.DateTime;
import visad.RealTuple;

/**
 * The TemporalWeatherXmlType class maps a TemporalWeather object to JAXB XmlElements for use by the
 * TemporalWeatherXmlAdaptor, which marshals/unmarshals a TemporalWeather object to/from XML.
 * 
 * @author Bruce Schubert
 */
public class TemporalWeatherXmlType {

    /**
     * Collection of XML compatible temporal weather entries 
     */
    @XmlElement(name = "temporalWeather")
    TemporalEntry[] entries;

    /**
     * Mandatory default constructor. Do not use.
     */
    public TemporalWeatherXmlType() {
        throw new UnsupportedOperationException("Default ctor not supported.");
    }

    /**
     * Initializes this XML adaptor from the incoming TemporalWeather object.
     * @param temporalMap 
     */
    public TemporalWeatherXmlType(TemporalWeather temporalMap) {

        Set<Map.Entry<DateTime, RealTuple>> set = temporalMap.entrySet();
        entries = new TemporalEntry[set.size()];
        int i = 0;
        for (Map.Entry<DateTime, RealTuple> entry : set) {
            entries[i++] = new TemporalEntry(entry.getKey(), entry.getValue());
        }
    }

    /**
     * XML Representation of the TemporalWeather object.
     */
    private static class TemporalEntry {

        @XmlAttribute
        public String time;
        @XmlElement
        public double[] values;

        TemporalEntry() {
            throw new UnsupportedOperationException("TemporalWeather default ctor not supported.");
        }

        TemporalEntry(DateTime time, RealTuple tuple) {
            this.time = Times.toZonedDateTime(time).format(DateTimeFormatter.ISO_DATE_TIME);
            this.values = tuple.getValues();
        }
    }

}
