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

import java.util.Set;
import javax.ws.rs.core.Application;
/**
 *
 * @author Bruce Schubert
 * @version $Id$
 */
@javax.ws.rs.ApplicationPath("rs")
public class ApplicationConfig extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        addRestResourceClasses(resources);        
        return resources;
    }

    /**
     * Do not modify addRestResourceClasses() method.
     * It is automatically populated with
     * all resources defined in the project.
     * If required, comment out calling this method in getClasses().
     */
    private void addRestResourceClasses(
                                        Set<Class<?>> resources) {
        resources.add(com.emxsys.wmt.web.FuelModelMessageBodyReader.class);
        resources.add(com.emxsys.wmt.web.FuelModelsResource.class);
        resources.add(com.emxsys.wmt.web.FuelMoistureMessageBodyReader.class);
        resources.add(com.emxsys.wmt.web.FuelMoistureResource.class);
        resources.add(com.emxsys.wmt.web.SunlightResource.class);
        resources.add(com.emxsys.wmt.web.SurfaceFireResource.class);
        resources.add(com.emxsys.wmt.web.SurfaceFuelMessageBodyReader.class);
        resources.add(com.emxsys.wmt.web.SurfaceFuelResource.class);
        resources.add(com.emxsys.wmt.web.TerrainMessageBodyReader.class);
        resources.add(com.emxsys.wmt.web.TerrainResource.class);
        resources.add(com.emxsys.wmt.web.WeatherMessageBodyReader.class);
        resources.add(com.emxsys.wmt.web.WeatherResource.class);
    }

}
