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

import com.emxsys.util.JsonUtil;
import com.emxsys.util.XmlUtil;
import com.emxsys.weather.api.BasicWeather;
import static com.emxsys.weather.api.WeatherType.*;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.test.framework.JerseyTest;
import javax.ws.rs.core.MediaType;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Ignore;
import visad.Real;


/**
 *
 * @author Bruce Schubert
 */
public class WeatherResourceTest extends JerseyTest {

    public WeatherResourceTest() throws Exception {
        super("com.emxsys.wmt.web");
    }

    @Test
    @Ignore
    public void testGetDefaults() {
        System.out.println("TESTING: getDefaults");
        BasicWeather expResult = BasicWeather.INVALID_WEATHER;
        ClientResponse response = super.webResource.path("weather")
            .accept(MediaType.APPLICATION_XML)
            .get(ClientResponse.class);
        assertTrue(response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.APPLICATION_XML + " but found: " + response.getType(),
            response.getType().equals(MediaType.APPLICATION_XML_TYPE));
        //System.out.println(">>>> " + XmlUtil.format(response.getEntity(String.class)));
        BasicWeather result = response.getEntity(BasicWeather.class);
        System.out.println(result.toString());
        assertTrue(result.equals(expResult));
    }

    @Test
    @Ignore
    public void testGetXml() {
        System.out.println("TESTING: getXml");
        Real airTemperature = new Real(AIR_TEMP_F, 1.0);
        Real relativeHumidity = new Real(REL_HUMIDITY, 2.0);
        Real windSpeed = new Real(WIND_SPEED_KTS, 3.0);
        Real windDirection = new Real(WIND_DIR, 4.0);
        Real cloudCover = new Real(CLOUD_COVER, 5.0);
        BasicWeather expResult = BasicWeather.fromReals(airTemperature, relativeHumidity, windSpeed, windDirection, cloudCover);
        ClientResponse response = super.webResource.path("weather")
            .queryParam("airTemperature", Double.toString(airTemperature.getValue()))
            .queryParam("relativeHumidity", Double.toString(relativeHumidity.getValue()))
            .queryParam("windSpeed", Double.toString(windSpeed.getValue()))
            .queryParam("windDirection", Double.toString(windDirection.getValue()))
            .queryParam("cloudCover", Double.toString(cloudCover.getValue()))
            .accept(MediaType.APPLICATION_XML)
            .get(ClientResponse.class);
        assertTrue(response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.APPLICATION_XML + " but found: " + response.getType(),
            response.getType().equals(MediaType.APPLICATION_XML_TYPE));
        //System.out.println(">>>> " + XmlUtil.format(response.getEntity(String.class)));
        BasicWeather result = response.getEntity(BasicWeather.class);
        System.out.println(result.toString());
        assertTrue(result.equals(expResult));
    }

    @Test
    @Ignore
    public void testGetJson() {
        System.out.println("TESTING: getJson");
        Real airTemperature = new Real(AIR_TEMP_F, 1.0);
        Real relativeHumidity = new Real(REL_HUMIDITY, 2.0);
        Real windSpeed = new Real(WIND_SPEED_KTS, 3.0);
        Real windDirection = new Real(WIND_DIR, 4.0);
        Real cloudCover = new Real(CLOUD_COVER, 5.0);
        BasicWeather expResult = BasicWeather.fromReals(airTemperature, relativeHumidity, windSpeed, windDirection, cloudCover);
        ClientResponse response = super.webResource.path("weather")
            .queryParam("airTemperature", Double.toString(airTemperature.getValue()))
            .queryParam("relativeHumidity", Double.toString(relativeHumidity.getValue()))
            .queryParam("windSpeed", Double.toString(windSpeed.getValue()))
            .queryParam("windDirection", Double.toString(windDirection.getValue()))
            .queryParam("cloudCover", Double.toString(cloudCover.getValue()))
            .accept(MediaType.APPLICATION_JSON)
            .get(ClientResponse.class);
        assertTrue(response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.APPLICATION_JSON + " but found: " + response.getType(),
            response.getType().equals(MediaType.APPLICATION_JSON_TYPE));
        //System.out.println(">>>> " + JsonUtil.format(response.getEntity(String.class)));
        BasicWeather result = response.getEntity(BasicWeather.class);
        System.out.println(result.toString());
        assertTrue(result.equals(expResult));
    }

    @Test
    @Ignore
    public void testGetText() {
        System.out.println("TESTING: getText");
        Real airTemperature = new Real(AIR_TEMP_F, 1.0);
        Real relativeHumidity = new Real(REL_HUMIDITY, 2.0);
        Real windSpeed = new Real(WIND_SPEED_KTS, 3.0);
        Real windDirection = new Real(WIND_DIR, 4.0);
        Real cloudCover = new Real(CLOUD_COVER, 5.0);
        BasicWeather expResult = BasicWeather.fromReals(airTemperature, relativeHumidity, windSpeed, windDirection, cloudCover);
        ClientResponse response = super.webResource.path("weather")
            .queryParam("airTemperature", Double.toString(airTemperature.getValue()))
            .queryParam("relativeHumidity", Double.toString(relativeHumidity.getValue()))
            .queryParam("windSpeed", Double.toString(windSpeed.getValue()))
            .queryParam("windDirection", Double.toString(windDirection.getValue()))
            .queryParam("cloudCover", Double.toString(cloudCover.getValue()))
            .accept(MediaType.TEXT_PLAIN)
            .get(ClientResponse.class);
        assertTrue(response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.TEXT_PLAIN + " but found: " + response.getType(),
            response.getType().equals(MediaType.TEXT_PLAIN_TYPE));
        //System.out.println(">>>> " + response.getEntity(String.class));
        assertTrue(response.getEntity(String.class).equals(expResult.toString()));
    }

    @Test
    public void testGetPointForecastTEXT() {
        System.out.println(
            "========================"
            + "TESTING: getPointForecastTEXT"
            + "========================");
        ClientResponse response = super.webResource.path("weather/pointforecast")
            .queryParam("latitude", Double.toString(34.25))
            .queryParam("longitude", Double.toString(-119.2))
            .queryParam("duration", Integer.toString(24))
            .accept(MediaType.TEXT_PLAIN)
            .get(ClientResponse.class);
        assertTrue(response.toString(), response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.TEXT_PLAIN + " but found: " + response.getType(),
            response.getType().equals(MediaType.TEXT_PLAIN_TYPE));
        System.out.println(">>>> " + response.getEntity(String.class));
    }

    @Test
    public void testGetPointForecastJSON() {
        System.out.println(
            "========================"
            + "TESTING: getPointForecastJSON"
            + "========================");
        ClientResponse response = super.webResource.path("weather/pointforecast")
            .queryParam("latitude", Double.toString(34.25))
            .queryParam("longitude", Double.toString(-119.2))
            .queryParam("duration", Integer.toString(24))
            .accept(MediaType.APPLICATION_JSON)
            .get(ClientResponse.class);
        assertTrue(response.toString(), response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.APPLICATION_JSON + " but found: " + response.getType(),
            response.getType().equals(MediaType.APPLICATION_JSON_TYPE));
        System.out.println(">>>> " + JsonUtil.format(response.getEntity(String.class)));
    }

    @Test
    public void testGetPointForecastXML() {
        System.out.println(
            "========================"
                + "TESTING: getPointForecastXML"
                + "========================");
        ClientResponse response = super.webResource.path("weather/pointforecast")
            .queryParam("latitude", Double.toString(34.25))
            .queryParam("longitude", Double.toString(-119.2))
            .queryParam("duration", Integer.toString(24))
            .accept(MediaType.APPLICATION_XML)
            .get(ClientResponse.class);
        assertTrue(response.toString(), response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.APPLICATION_XML + " but found: " + response.getType(),
            response.getType().equals(MediaType.APPLICATION_XML_TYPE));
        System.out.println(">>>> " + XmlUtil.format(response.getEntity(String.class)));
    }
    
    @Test
    public void testGetAreaForecastTEXT() {
        System.out.println(
            "========================"
            + "TESTING: getAreaForecastTEXT"
            + "========================");
        ClientResponse response = super.webResource.path("weather/areaforecast")
            .queryParam("minLatitude", Double.toString(34.2))
            .queryParam("minLongitude", Double.toString(-119.25))
            .queryParam("maxLatitude", Double.toString(34.25))
            .queryParam("maxLongitude", Double.toString(-119.2))
            .queryParam("duration", Integer.toString(24))
            .accept(MediaType.TEXT_PLAIN)
            .get(ClientResponse.class);
        assertTrue(response.toString(), response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.TEXT_PLAIN + " but found: " + response.getType(),
            response.getType().equals(MediaType.TEXT_PLAIN_TYPE));
        System.out.println(">>>> " + response.getEntity(String.class));
    }

    @Test
    public void testGetAreaForecastJSON() {
        System.out.println(
            "========================"
            + "TESTING: getAreaForecastJSON"
            + "========================");
        ClientResponse response = super.webResource.path("weather/areaforecast")
            .queryParam("minLatitude", Double.toString(34.2))
            .queryParam("minLongitude", Double.toString(-119.25))
            .queryParam("maxLatitude", Double.toString(34.25))
            .queryParam("maxLongitude", Double.toString(-119.2))
            .queryParam("duration", Integer.toString(24))
            .accept(MediaType.APPLICATION_JSON)
            .get(ClientResponse.class);
        assertTrue(response.toString(), response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.APPLICATION_JSON + " but found: " + response.getType(),
            response.getType().equals(MediaType.APPLICATION_JSON_TYPE));
        System.out.println(">>>> " + JsonUtil.format(response.getEntity(String.class)));
    }

    @Test
    public void testGetAreaForecastXML() {
        System.out.println(
            "========================"
                + "TESTING: getAreaForecastXML"
                + "========================");
        ClientResponse response = super.webResource.path("weather/areaforecast")
            .queryParam("minLatitude", Double.toString(34.2))
            .queryParam("minLongitude", Double.toString(-119.25))
            .queryParam("maxLatitude", Double.toString(34.25))
            .queryParam("maxLongitude", Double.toString(-119.2))
            .queryParam("duration", Integer.toString(24))
            .accept(MediaType.APPLICATION_XML)
            .get(ClientResponse.class);
        assertTrue(response.toString(), response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.APPLICATION_XML + " but found: " + response.getType(),
            response.getType().equals(MediaType.APPLICATION_XML_TYPE));
        System.out.println(">>>> " + XmlUtil.format(response.getEntity(String.class)));
    }

    @Test
    public void testGetAreaObservationsTEXT() {
        System.out.println(
            "========================"
            + "TESTING: GetAreaObservationsTEXT"
            + "========================");
        ClientResponse response = super.webResource.path("weather/areaobservations")
            .queryParam("minLatitude", Double.toString(34.0))
            .queryParam("minLongitude", Double.toString(-120.0))
            .queryParam("maxLatitude", Double.toString(35.0))
            .queryParam("maxLongitude", Double.toString(-118.0))
            .queryParam("duration", Integer.toString(24))
            .accept(MediaType.TEXT_PLAIN)
            .get(ClientResponse.class);
        assertTrue(response.toString(), response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.TEXT_PLAIN + " but found: " + response.getType(),
            response.getType().equals(MediaType.TEXT_PLAIN_TYPE));
        System.out.println(">>>> " + response.getEntity(String.class));
    }

    @Test
    public void testGetAreaObservationsJSON() {
        System.out.println(
            "========================"
            + "TESTING: GetAreaObservationsJSON"
            + "========================");
        ClientResponse response = super.webResource.path("weather/areaobservations")
            .queryParam("minLatitude", Double.toString(34.0))
            .queryParam("minLongitude", Double.toString(-120.0))
            .queryParam("maxLatitude", Double.toString(35.0))
            .queryParam("maxLongitude", Double.toString(-118.0))
            .queryParam("duration", Integer.toString(24))
            .accept(MediaType.APPLICATION_JSON)
            .get(ClientResponse.class);
        assertTrue(response.toString(), response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.APPLICATION_JSON + " but found: " + response.getType(),
            response.getType().equals(MediaType.APPLICATION_JSON_TYPE));
        System.out.println(">>>> " + JsonUtil.format(response.getEntity(String.class)));
    }

    @Test
    public void testGetAreaObservationsXML() {
        System.out.println(
            "========================"
                + "TESTING: GetAreaObservationsXML"
                + "========================");
        ClientResponse response = super.webResource.path("weather/areaobservations")
            .queryParam("minLatitude", Double.toString(34.0))
            .queryParam("minLongitude", Double.toString(-120.0))
            .queryParam("maxLatitude", Double.toString(35.0))
            .queryParam("maxLongitude", Double.toString(-118.0))
            .queryParam("duration", Integer.toString(24))
            .accept(MediaType.APPLICATION_XML)
            .get(ClientResponse.class);
        assertTrue(response.toString(), response.getStatus() == 200);
        assertTrue("Expecting: " + MediaType.APPLICATION_XML + " but found: " + response.getType(),
            response.getType().equals(MediaType.APPLICATION_XML_TYPE));
        System.out.println(">>>> " + XmlUtil.format(response.getEntity(String.class)));
    }

}
