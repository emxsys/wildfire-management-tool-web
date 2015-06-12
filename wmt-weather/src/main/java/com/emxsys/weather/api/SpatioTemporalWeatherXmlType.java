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

import com.emxsys.gis.api.GeoCoord2D;
import com.emxsys.visad.RealTupleTypeXmlAdapter;
import java.util.Map;
import java.util.Set;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;
import visad.RealTupleType;
import visad.georef.LatLonPoint;

/**
 * The SpatioTemporalWeatherXmlType class maps a SpatioTemporalWeather object to JAXB XmlElements
 * for use by the SpatioTemporalWeatherXmlAdaptor, which marshals/unmarshals a SpatioTemporalWeather
 * object to/from XML.
 *
 * <pre>
 * 
 * </pre>
 * 
 * @author Bruce Schubert
 */
public class SpatioTemporalWeatherXmlType {

    @XmlElement
    @XmlJavaTypeAdapter(RealTupleTypeXmlAdapter.class)
    RealTupleType range;

    @XmlElement(name = "spatialDomain")
    SpatialEntry[] entries;

    /**
     * Mandatory default constructor. Do not use.
     */
    public SpatioTemporalWeatherXmlType() {
        throw new UnsupportedOperationException("Default ctor not supported.");
    }

    public SpatioTemporalWeatherXmlType(SpatioTemporalWeather map) {
        this.range = map.getRange();
        Set<Map.Entry<GeoCoord2D, TemporalWeather>> set = map.entrySet();
        entries = new SpatialEntry[set.size()];
        int i = 0;
        for (Map.Entry<GeoCoord2D, TemporalWeather> entry : set) {
            LatLonPoint latLon = entry.getKey();
            entries[i] = new SpatialEntry(
                    latLon.getLatitude().getValue(),
                    latLon.getLongitude().getValue(),
                    entry.getValue());
            i++;
        }
    }

    public static class SpatialEntry {

        @XmlAttribute
        public double latitude;
        @XmlAttribute
        public double longitude;
        @XmlElement(name = "temporalDomain")
        @XmlJavaTypeAdapter(TemporalWeatherXmlAdapter.class)
        public TemporalWeather temporalWeather;

        public SpatialEntry() {
        }

        public SpatialEntry(double latitude, double longitude, TemporalWeather temporalWeather) {
            this.latitude = latitude;
            this.longitude = longitude;
            this.temporalWeather = temporalWeather;
        }
    }

}
