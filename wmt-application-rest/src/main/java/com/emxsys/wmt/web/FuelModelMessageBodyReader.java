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
import com.sun.jersey.api.json.JSONJAXBContext;
import java.io.IOException;
import java.io.InputStream;
import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.MessageBodyReader;
import javax.ws.rs.ext.Provider;
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import org.openide.util.Exceptions;

/**
 *
 * @author Bruce Schubert
 */
@Provider
//@Consumes("*/*")
public class FuelModelMessageBodyReader implements MessageBodyReader<BasicFuelModel> {

    Exception lastError = null;

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

        // Note: Do not close the entity input stream in your MessageBodyReader<T> 
        // implementation. The stream will be automatically closed by Jersey runtime.
        BasicFuelModel model;
        if (mediaType.equals(MediaType.APPLICATION_JSON_TYPE)) {
            // Explicit JSON object, from a FormData Blob 
            model = unmarshalJSON(entityStream);
            if (model == null) {
                throw new WebApplicationException(Response.serverError().
                        entity(lastError.getMessage()).
                        type("text/plain").build());
            }
        } else if (mediaType.equals(MediaType.APPLICATION_XML_TYPE)) {
            // Explicit XML object
            model = unmarshalXML(entityStream);
            if (model == null) {
                throw new WebApplicationException(Response.serverError().
                        entity(lastError.getMessage()).
                        type("text/plain").build());
            }
        } else if (mediaType.equals(MediaType.TEXT_PLAIN_TYPE)) {
            // Plain text, either JSON or XML, attempt to decode JSON first (most likely format)
            model = unmarshalJSON(entityStream);
            if (model == null) {
                model = unmarshalXML(entityStream);
            }
            if (model == null) {
                throw new WebApplicationException(Response.serverError().
                        entity("Text is not valid JSON or XML").
                        type("text/plain").build());
            }
        } else {
            throw new WebApplicationException(Response.serverError().
                    entity("Unsupported media type: " + mediaType.toString()).
                    type("text/plain").build());
        }
        return model;
    }

    private BasicFuelModel unmarshalXML(InputStream entityStream) {
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(BasicFuelModel.class);
            return (BasicFuelModel) jaxbContext.createUnmarshaller().unmarshal(entityStream);
        } catch (JAXBException ex) {
            lastError = ex;
            Exceptions.printStackTrace(ex);
            return null;
        }
    }

    private BasicFuelModel unmarshalJSON(InputStream entityStream) {
        try {
            JSONJAXBContext jaxbContext = new JSONJAXBContext(BasicFuelModel.class);
            return (BasicFuelModel) jaxbContext.createJSONUnmarshaller().unmarshalFromJSON(entityStream, BasicFuelModel.class);
        } catch (JAXBException ex) {
            lastError = ex;
            Exceptions.printStackTrace(ex);
            return null;
        }
    }
}
