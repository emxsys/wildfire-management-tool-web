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
package com.emxsys.solar.api;

import com.emxsys.gis.api.Coord3D;
import com.emxsys.gis.api.GeoCoord3D;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;
import javax.xml.bind.annotation.XmlValue;
import visad.georef.LatLonPoint;

/**
 * The Coord3DXmlType class maps a WMT Coord3D to JAXB XmlElements for use by the
 * Coord3DXmlAdaptor, which marshals/unmarshals a Coord3D object to/from XML.
 *
 * This class provides a mandatory default constructor for JAXB, which is not provided by the VisAD
 * LatLonTuple implementation class.
 *
 * @see LatLonPointXmlAdaptor
 * @author Bruce Schubert
 */
@XmlType()
public class Coord3DXmlType {

    @XmlElement
    public double latitude = Double.NaN;
    @XmlElement
    public double longitude = Double.NaN;
    @XmlElement
    public double altitude = Double.NaN;

    /**
     * Mandatory default constructor.
     */
    public Coord3DXmlType() {
        this(GeoCoord3D.INVALID_COORD);
    }

    public Coord3DXmlType(Coord3D coord) {
        if (coord != null) {
            this.latitude = coord.getLatitude().getValue();
            this.longitude = coord.getLongitude().getValue();
            this.altitude = coord.getAltitude().getValue();
        }
    }
}
