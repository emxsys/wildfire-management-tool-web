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
 *     - Neither the name of Bruce Schubert,  nor the names of its 
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

import com.emxsys.wildfire.api.BasicFuelModel;
import com.emxsys.wildfire.api.FuelModel;
import com.sun.jersey.api.json.JSONJAXBContext;
import java.io.IOException;
import java.io.InputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import javax.ws.rs.Consumes;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.ext.MessageBodyReader;
import javax.ws.rs.ext.Provider;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import org.openide.util.Exceptions;

/**
 *
 * @author Bruce Schubert
 */
@Provider
@Consumes("application/json")
public class FuelModelMessageBodyReader implements MessageBodyReader<BasicFuelModel> {

    @Override
    public boolean isReadable(Class<?> type, Type genericType, Annotation[] annotations, MediaType mediaType) {
        return type == BasicFuelModel.class;
    }

    @Override
    public BasicFuelModel readFrom(
            Class<BasicFuelModel> type,
            Type genericType,
            Annotation[] annotations,
            MediaType mediaType,
            MultivaluedMap<String, String> httpHeaders,
            InputStream entityStream)
            throws IOException, WebApplicationException {

        // Do not close the entity input stream in your  MessageBodyReader<T> 
        // implementation. The stream will be automatically closed by Jersey runtime.
        try {
            BasicFuelModel model;
            if (mediaType.equals(MediaType.APPLICATION_XML_TYPE)) {
                JAXBContext jaxbContext = JAXBContext.newInstance(BasicFuelModel.class);
                model = (BasicFuelModel) jaxbContext.createUnmarshaller().unmarshal(entityStream);

            } else if (mediaType.equals(MediaType.APPLICATION_JSON_TYPE)) {
                JSONJAXBContext jaxbContext = new JSONJAXBContext(BasicFuelModel.class);
                model = (BasicFuelModel) jaxbContext.createJSONUnmarshaller().unmarshalFromJSON(entityStream, BasicFuelModel.class);
            } else {
                throw new UnsupportedOperationException("Unsupported media type: " + type.toString());
            }
            return model;
        } catch (JAXBException jaxbException) {
            throw new RuntimeException("Error deserializing a FuelModel.", jaxbException);
        }
    }

}
