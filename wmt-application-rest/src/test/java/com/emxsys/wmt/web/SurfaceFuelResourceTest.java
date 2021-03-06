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

import com.emxsys.gis.api.BasicTerrain;
import com.emxsys.gis.api.GeoCoord3D;
import com.emxsys.solar.api.BasicSunlight;
import com.emxsys.solar.spi.SunlightProviderFactory;
import com.emxsys.util.JsonUtil;
import com.emxsys.util.XmlUtil;
import com.emxsys.weather.api.BasicWeather;
import com.emxsys.weather.api.WeatherType;
import com.emxsys.wildfire.api.BasicFuelModel;
import com.emxsys.wildfire.api.BasicFuelMoisture;
import com.emxsys.wildfire.api.WeatherConditions;
import static com.emxsys.wildfire.api.WildfireType.ASPECT;
import static com.emxsys.wildfire.api.WildfireType.ELEVATION;
import static com.emxsys.wildfire.api.WildfireType.SLOPE;
import com.emxsys.wildfire.behavior.SurfaceFuel;
import com.emxsys.wildfire.behavior.SurfaceFuelProvider;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.multipart.BodyPart;
import com.sun.jersey.multipart.FormDataMultiPart;
import com.sun.jersey.test.framework.JerseyTest;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import javax.ws.rs.core.MediaType;
import static javax.ws.rs.core.MediaType.*;
import org.junit.Test;
import static org.junit.Assert.*;
import org.junit.Ignore;
import visad.Real;


/**
 *
 * @author Bruce Schubert
 */
//@Ignore
public class SurfaceFuelResourceTest extends JerseyTest {

    public SurfaceFuelResourceTest() throws Exception {
        super("com.emxsys.wmt.web");

    }

    @Test
    //@Ignore
    public void testCreateSurfaceFuel() {
        System.out.println("TESTING: createSurfaceFuel");
        SurfaceFuelResource instance = new SurfaceFuelResource();

        // Get a Fuel Model
        ClientResponse fuelModelResponse = super.webResource.path("fuelmodels/6")
            .accept(APPLICATION_JSON)
            .get(ClientResponse.class);
        assertTrue("Status: expected 200 but got " + fuelModelResponse.getStatus(), fuelModelResponse.getStatus() == 200);
        BasicFuelModel fuelModel = fuelModelResponse.getEntity(BasicFuelModel.class);
        System.out.println(fuelModel);
        // Get the Fuel Moisture
        ClientResponse fuelMoistureResponse = super.webResource.path("fuelmoisture")
            .queryParam("conditions", "hot_and_dry")
            .accept(APPLICATION_JSON)
            .get(ClientResponse.class);
        assertTrue("Status: expected 200 but got " + fuelMoistureResponse.getStatus(), fuelMoistureResponse.getStatus() == 200);
        BasicFuelMoisture fuelMoisture = fuelMoistureResponse.getEntity(BasicFuelMoisture.class);
        System.out.println(fuelMoisture);
        // Get the "expected" Fuel Bed 
        SurfaceFuelProvider provider = new SurfaceFuelProvider();
        SurfaceFuel expResult = provider.getSurfaceFuel(fuelModel, fuelMoisture);
        System.out.println(expResult);

        FormDataMultiPart formData = new FormDataMultiPart();
        formData.field("fuelModel", fuelModel, APPLICATION_JSON_TYPE);
        formData.field("fuelMoisture", fuelMoisture, APPLICATION_JSON_TYPE);
        ClientResponse fuelResponse = super.webResource.path("surfacefuel")
            .type(MULTIPART_FORM_DATA_TYPE)
            .accept(APPLICATION_XML)
            .post(ClientResponse.class, formData);
        assertTrue("Status: expected 200 but got " + fuelResponse.getStatus(), fuelResponse.getStatus() == 200);
        assertTrue("Expecting: " + APPLICATION_XML + " but found: " + fuelResponse.getType(),
            fuelResponse.getType().equals(APPLICATION_XML_TYPE));
        SurfaceFuel entity = fuelResponse.getEntity(SurfaceFuel.class);
        assertTrue(entity.equals(expResult));
        System.out.println("Text Representation >>>>\n" + entity.toString());
    }

    @Test
    //@Ignore
    public void testCreateConditionedSurfaceFuel() {
        System.out.println("TESTING: createConditionedSurfaceFuel");
        SurfaceFuelResource instance = new SurfaceFuelResource();

        // Get a Fuel Model
        ClientResponse fuelModelResponse = super.webResource.path("fuelmodels/6")
            .accept(APPLICATION_JSON)
            .get(ClientResponse.class);
        assertTrue("Status: expected 200 but got " + fuelModelResponse.getStatus(), fuelModelResponse.getStatus() == 200);
        BasicFuelModel fuelModel = fuelModelResponse.getEntity(BasicFuelModel.class);

        // Sunlight param
        ZonedDateTime date = ZonedDateTime.of(2014, 05, 29, 15, 00, 00, 00, ZoneId.of("-8"));
        GeoCoord3D location = GeoCoord3D.fromDegreesAndMeters(34.25, -119.2, 60);
        BasicSunlight sunlight = SunlightProviderFactory.getInstance().getSunlight(date, location);

        // Weather param
        BasicWeather weather = new BasicWeather();
        weather.setAirTemperature(new Real(WeatherType.AIR_TEMP_F, 85));
        weather.setRelativeHumidity(new Real(WeatherType.REL_HUMIDITY, 25));
        weather.setWindSpeed(new Real(WeatherType.WIND_SPEED_MPH, 5));
        weather.setWindDirection(new Real(WeatherType.WIND_DIR, 90));
        weather.setCloudCover(new Real(WeatherType.CLOUD_COVER, 10));

        // Terrain param
        BasicTerrain terrain = new BasicTerrain();
        terrain.setAspect(new Real(ASPECT, 235));
        terrain.setSlope(new Real(SLOPE, 20));
        terrain.setElevation(new Real(ELEVATION, 100));

        // Terrestrial or plume shading
        boolean shaded = false;
        
        // Get the initial Fuel Moisture
        ClientResponse fuelMoistureResponse = super.webResource.path("fuelmoisture")
            .queryParam("conditions", "hot_and_dry")
            .accept(APPLICATION_JSON)
            .get(ClientResponse.class);
        assertTrue("Status: expected 200 but got " + fuelMoistureResponse.getStatus(), fuelMoistureResponse.getStatus() == 200);
        BasicFuelMoisture fuelMoisture = fuelMoistureResponse.getEntity(BasicFuelMoisture.class);

        // Get the "expected" Fuel Bed 
        SurfaceFuelProvider provider = new SurfaceFuelProvider();
        SurfaceFuel expResult = provider.getSurfaceFuel(fuelModel, sunlight, weather, terrain, shaded, fuelMoisture);
        System.out.println(expResult);

        FormDataMultiPart formData = new FormDataMultiPart();
        formData.field("fuelModel", fuelModel, APPLICATION_JSON_TYPE);
        formData.field("sunlight", sunlight, APPLICATION_JSON_TYPE);
        formData.field("weather", weather, APPLICATION_JSON_TYPE);
        formData.field("terrain", terrain, APPLICATION_JSON_TYPE);
        formData.field("shaded", "false", APPLICATION_JSON_TYPE);
        formData.field("initialFuelMoisture", fuelMoisture, APPLICATION_JSON_TYPE);
        ClientResponse fuelResponse = super.webResource.path("surfacefuel/conditioned")
            .type(MULTIPART_FORM_DATA_TYPE)
            .accept(APPLICATION_XML)
            .post(ClientResponse.class, formData);
        assertTrue("Status: expected 200 but got " + fuelResponse.getStatus(), fuelResponse.getStatus() == 200);
        assertTrue("Expecting: " + APPLICATION_XML + " but found: " + fuelResponse.getType(),
            fuelResponse.getType().equals(APPLICATION_XML_TYPE));
        SurfaceFuel entity = fuelResponse.getEntity(SurfaceFuel.class);
        assertTrue(entity.equals(expResult));
        System.out.println("Text Representation >>>>\n" + entity.toString());
    }

    @Test
    //@Ignore
    public void testGetXml() {
        System.out.println("TESTING: getXml");

        BasicFuelModel fuelModel = BasicFuelModel.from(6);
        BasicFuelMoisture fuelMoisture = BasicFuelMoisture.fromWeatherConditions(WeatherConditions.HOT_AND_DRY);

        FormDataMultiPart formData = new FormDataMultiPart();
        formData.field("fuelModel", fuelModel, APPLICATION_XML_TYPE);
        formData.field("fuelMoisture", fuelMoisture, APPLICATION_XML_TYPE);
        ClientResponse fuelResponse = super.webResource.path("surfacefuel")
            .type(MULTIPART_FORM_DATA_TYPE)
            .accept(APPLICATION_XML)
            .post(ClientResponse.class, formData);
        assertTrue("Status: expected 200 but got " + fuelResponse.getStatus(), fuelResponse.getStatus() == 200);
        assertTrue("Expecting: " + APPLICATION_XML + " but found: " + fuelResponse.getType(),
            fuelResponse.getType().equals(APPLICATION_XML_TYPE));
        String entity = fuelResponse.getEntity(String.class);
        assertTrue("Looks like XML:\n" + entity, entity.startsWith("<"));
        System.out.println(">>>> XML Representation:\n" + XmlUtil.format(entity));
    }

    @Test
    //@Ignore
    public void testGetJson() {
        System.out.println("TESTING: getJSON");

        BasicFuelModel fuelModel = BasicFuelModel.from(6);
        BasicFuelMoisture fuelMoisture = BasicFuelMoisture.fromWeatherConditions(WeatherConditions.HOT_AND_DRY);

        FormDataMultiPart formData = new FormDataMultiPart();
        formData.field("mime-type", "application/json", MediaType.TEXT_PLAIN_TYPE);
        formData.field("fuelModel", fuelModel, APPLICATION_JSON_TYPE);
        formData.field("fuelMoisture", fuelMoisture, APPLICATION_JSON_TYPE);

        ClientResponse fuelResponse = super.webResource.path("surfacefuel")
            .type(MULTIPART_FORM_DATA_TYPE)
            .accept(APPLICATION_JSON)
            .post(ClientResponse.class, formData);
        assertTrue("Status: expected 200 but got " + fuelResponse.getStatus(), fuelResponse.getStatus() == 200);
        assertTrue("Expecting: " + APPLICATION_JSON + " but found: " + fuelResponse.getType(),
            fuelResponse.getType().equals(APPLICATION_JSON_TYPE));
        String entity = fuelResponse.getEntity(String.class);
        assertTrue("Looks like JSON:\n" + entity, entity.trim().startsWith("{"));
        System.out.println(">>>> JSON Representation:\n" + JsonUtil.format(entity));
    }

}
