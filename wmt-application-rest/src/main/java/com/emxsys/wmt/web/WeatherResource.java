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
package com.emxsys.wmt.web;

import com.emxsys.gis.api.GeoCoord2D;
import com.emxsys.visad.SpatialDomain;
import com.emxsys.visad.TemporalDomain;
import com.emxsys.weather.api.BasicWeather;
import com.emxsys.weather.api.WeatherModel;
import com.emxsys.weather.api.WeatherProvider;
import static com.emxsys.weather.api.WeatherType.*;
import com.emxsys.weather.api.services.WeatherForecaster;
import com.emxsys.weather.api.services.WeatherObserver;
import com.emxsys.weather.spi.WeatherProviderFactory;
import java.time.Duration;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalAmount;
import java.util.Arrays;
import java.util.List;
import javax.ws.rs.core.Context;
import javax.ws.rs.Produces;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import static javax.ws.rs.core.MediaType.*;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import visad.Real;


/**
 * Weather REST Web Service.
 *
 * @author Bruce Schubert
 */
@Path("/weather")
public class WeatherResource {

    @Context
    private HttpHeaders headers;
    private static final List<MediaType> permittedTypes = Arrays.asList(
        APPLICATION_JSON_TYPE, APPLICATION_XML_TYPE, TEXT_PLAIN_TYPE);

    /**
     * Creates a new instance of WeatherResource
     */
    public WeatherResource() {
    }

    /**
     * Retrieves representation of an instance com.emxsys.weather.api.BasicWeather.
     *
     * @param mimeType Optional. Either application/json, application/xml or text/plain.
     * @param airTemperature [Fahrenheit]
     * @param relativeHumidity [Percent]
     * @param windSpeed [Knots]
     * @param windDirection [Degrees]
     * @param cloudCover [Percent]
     * @return an instance of BasicWeather.
     */
    @GET
    @Produces({APPLICATION_XML, APPLICATION_JSON, TEXT_PLAIN})
    public Response getWeather(
        @DefaultValue("") @QueryParam("mime-type") String mimeType,
        @QueryParam("airTemperature") Double airTemperature,
        @QueryParam("relativeHumidity") Double relativeHumidity,
        @QueryParam("windSpeed") Double windSpeed,
        @QueryParam("windDirection") Double windDirection,
        @QueryParam("cloudCover") Double cloudCover) {

        // Dermine representation
        MediaType mediaType = WebUtil.getPermittedMediaType(
            mimeType, permittedTypes, headers, MediaType.TEXT_PLAIN_TYPE);

        // Create the resource
        BasicWeather weather = BasicWeather.fromReals(
            new Real(AIR_TEMP_F, airTemperature == null ? Double.NaN : airTemperature),
            new Real(REL_HUMIDITY, relativeHumidity == null ? Double.NaN : relativeHumidity),
            new Real(WIND_SPEED_KTS, windSpeed == null ? Double.NaN : windSpeed),
            new Real(WIND_DIR, windDirection == null ? Double.NaN : windDirection),
            new Real(CLOUD_COVER, cloudCover == null ? Double.NaN : cloudCover));

        // Return the representation
        return Response.ok(
            mediaType.equals(TEXT_PLAIN_TYPE) ? weather.toString() : weather,
            mediaType).build();

    }

    @GET
    @Path("/pointforecast")
    @Produces({APPLICATION_XML, APPLICATION_JSON, TEXT_PLAIN})
    public Response getPointForecast(
        @DefaultValue("") @QueryParam("mime-type") String mimeType,
        @QueryParam("latitude") double latitude,
        @QueryParam("longitude") double longitude,
        @QueryParam("duration") int duration) {

        // Dermine representation from optional mime-type param
        MediaType mediaType = WebUtil.getPermittedMediaType(
            mimeType,
            permittedTypes,
            headers,
            APPLICATION_JSON_TYPE);

        List<WeatherProvider> providers = WeatherProviderFactory.getWeatherForecasters();
        if (providers.isEmpty()) {
            throw new WebApplicationException(
                new RuntimeException("WeatherProviderFactory.getWeatherForecasters() provided empty list."),
                Response.Status.INTERNAL_SERVER_ERROR);
        }
        WeatherModel wxModel = null;
        for (WeatherProvider provider : providers) {
            WeatherForecaster forecaster = provider.getService(WeatherForecaster.class);
            SpatialDomain pointDomain = SpatialDomain.from(GeoCoord2D.fromDegrees(latitude, longitude));
            TemporalDomain timeDomain = TemporalDomain.from(ZonedDateTime.now(), duration);
            wxModel = forecaster.getForecast(pointDomain, timeDomain);
            if (wxModel != null) {
                break;
            }
        }

        if (wxModel == null) {
            throw new WebApplicationException(
                new RuntimeException("null weather model"),
                Response.Status.INTERNAL_SERVER_ERROR);
        }
        // Create the resource

        Object entity = mediaType.equals(TEXT_PLAIN_TYPE) ? wxModel.toString() : wxModel;
        return Response.ok(entity, mediaType).build();
    }

    @GET
    @Path("/areaforecast")
    @Produces({APPLICATION_XML, APPLICATION_JSON, TEXT_PLAIN})
    public Response getAreaForecast(
        @DefaultValue("") @QueryParam("mime-type") String mimeType,
        @QueryParam("maxLatitude") double maxLatitude,
        @QueryParam("maxLongitude") double maxLongitude,
        @QueryParam("minLatitude") double minLatitude,
        @QueryParam("minLongitude") double minLongitude,
        @QueryParam("duration") int duration) {

        // Dermine representation from optional mime-type param
        MediaType mediaType = WebUtil.getPermittedMediaType(
            mimeType,
            permittedTypes,
            headers,
            APPLICATION_JSON_TYPE);

        List<WeatherProvider> providers = WeatherProviderFactory.getWeatherForecasters();
        if (providers.isEmpty()) {
            throw new WebApplicationException(
                new RuntimeException("WeatherProviderFactory.getWeatherForecasters() provided empty list."),
                Response.Status.INTERNAL_SERVER_ERROR);
        }
        WeatherModel wxModel = null;
        for (WeatherProvider provider : providers) {
            WeatherForecaster forecaster = provider.getService(WeatherForecaster.class);
            SpatialDomain area = SpatialDomain.from(
                GeoCoord2D.fromDegrees(minLatitude, minLongitude),
                GeoCoord2D.fromDegrees(maxLatitude, maxLongitude));
            TemporalDomain time = TemporalDomain.from(ZonedDateTime.now(), duration);
            wxModel = forecaster.getForecast(area, time);
            if (wxModel != null) {
                break;
            }
        }

        if (wxModel == null) {
            throw new WebApplicationException(
                new RuntimeException("null weather model"),
                Response.Status.INTERNAL_SERVER_ERROR);
        }
        // Create the resource

        Object entity = mediaType.equals(TEXT_PLAIN_TYPE) ? wxModel.toString() : wxModel;
        return Response.ok(entity, mediaType).build();
    }
    
    @GET
    @Path("/areaobservations")
    @Produces({APPLICATION_XML, APPLICATION_JSON, TEXT_PLAIN})
    public Response getAreaObservations(
        @DefaultValue("") @QueryParam("mime-type") String mimeType,
        @QueryParam("maxLatitude") double maxLatitude,
        @QueryParam("maxLongitude") double maxLongitude,
        @QueryParam("minLatitude") double minLatitude,
        @QueryParam("minLongitude") double minLongitude,
        @QueryParam("duration") int duration) {

        // Dermine representation from optional mime-type param
        MediaType mediaType = WebUtil.getPermittedMediaType(
            mimeType,
            permittedTypes,
            headers,
            APPLICATION_JSON_TYPE);

        List<WeatherProvider> observers = WeatherProviderFactory.getWeatherObservers();
        if (observers.isEmpty()) {
            throw new WebApplicationException(
                new RuntimeException("WeatherProviderFactory.getWeatherObservers() provided empty list."),
                Response.Status.INTERNAL_SERVER_ERROR);
        }
        WeatherModel wxModel = null;
        for (WeatherProvider provider : observers) {
            WeatherObserver observer = provider.getService(WeatherObserver.class);
            SpatialDomain area = SpatialDomain.from(
                GeoCoord2D.fromDegrees(minLatitude, minLongitude),
                GeoCoord2D.fromDegrees(maxLatitude, maxLongitude));
            //TemporalDomain time = TemporalDomain.from(ZonedDateTime.now(), duration);
            wxModel = observer.getLatestObservations(area, Duration.ofHours(duration));
            if (wxModel != null) {
                break;
            }
        }

        if (wxModel == null) {
            throw new WebApplicationException(
                new RuntimeException("null weather model"),
                Response.Status.INTERNAL_SERVER_ERROR);
        }
        // Create the resource

        Object entity = mediaType.equals(TEXT_PLAIN_TYPE) ? wxModel.toString() : wxModel;
        return Response.ok(entity, mediaType).build();
    }

}
