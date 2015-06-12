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
import java.rmi.RemoteException;
import java.util.LinkedHashMap;
import org.openide.util.Exceptions;
import visad.FieldImpl;
import visad.FlatField;
import visad.FunctionType;
import visad.MathType;
import visad.RealTuple;
import visad.RealTupleType;
import visad.SampledSet;
import visad.VisADException;
import visad.util.DataUtility;

/**
 *
 * @author Bruce Schubert
 * @version $Id$
 */
public class SpatioTemporalWeatherMap extends LinkedHashMap<GeoCoord2D, TemporalWeatherMap> {

    private RealTupleType range;

    public SpatioTemporalWeatherMap() {
    }

    public SpatioTemporalWeatherMap(FieldImpl field) {
        try {

            MathType domainType = DataUtility.getDomainType(field);
            boolean isSpatialThenTemporal = domainType.equals(RealTupleType.LatitudeLongitudeTuple);
            if (isSpatialThenTemporal) {
                // ((Lat,Lon) -> ((Time) -> (fire weather)))

                // Get the weather math type (we know the FieldImpl's range is a FlatField)
                RealTupleType wxTupleType = ((FunctionType) DataUtility.getRangeType(field)).getFlatRange();
                this.range = wxTupleType;

                int numLatLons = field.getLength();
                SampledSet latLonSet = (SampledSet) field.getDomainSet();
                for (int i = 0; i < numLatLons; i++) {
                    RealTuple latLon = DataUtility.getSample(latLonSet, i);
                    double[] coords = latLon.getValues();
                    GeoCoord2D coord = new GeoCoord2D(coords[0], coords[1]);
                    FlatField temporalField = (FlatField) field.getSample(i);
                    TemporalWeatherMap weather = new TemporalWeatherMap(temporalField);
                    this.put(coord, weather);
                }
            } else {
                throw new UnsupportedOperationException("Temporal-spatial ordering is not supported yet.");
            }
        } catch (VisADException | RemoteException ex) {
            Exceptions.printStackTrace(ex);
            throw new RuntimeException(ex);
        }
    }

    public RealTupleType getRange() {
        return range;
    }
    

}
