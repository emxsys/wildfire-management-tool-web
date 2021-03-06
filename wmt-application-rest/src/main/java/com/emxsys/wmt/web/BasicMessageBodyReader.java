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

import com.emxsys.wildfire.behavior.SurfaceFuel;
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
import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;


/**
 *
 * @author Bruce Schubert
 * @param <T>
 */
public abstract class BasicMessageBodyReader<T> implements MessageBodyReader<T> {

    Exception lastError = null;

//    @Override
//    public boolean isReadable(Class<?> type, Type genericType, Annotation[] annotations,
//                              MediaType mediaType) {
//        return true
//    }

    @Override
    public T readFrom(
        Class<T> type,
        Type genericType,
        Annotation[] annotations,
        MediaType mediaType,
        MultivaluedMap<String, String> httpHeaders,
        InputStream entityStream)
        throws IOException, WebApplicationException {
        // Note: Do not close the entity input stream in your MessageBodyReader<T> 
        // implementation. The stream will be automatically closed by Jersey runtime.

        T resource = null;
        if (mediaType.equals(MediaType.APPLICATION_JSON_TYPE)) {
            // Explicit JSON object, from a Javascript FormData Blob or the Jersey Unit Test
            resource = unmarshalJSON(entityStream, type);
        } else if (mediaType.equals(MediaType.APPLICATION_XML_TYPE)) {
            // Explicit XML object, from a Javascript FormData Blob or the Jersey Unit Test
            resource = unmarshalXML(entityStream, type);
        } else if (mediaType.equals(MediaType.TEXT_PLAIN_TYPE)) {
            // If plain text, then attempt to decode as JSON (the most likely format).
            // This is format is used when the JavaScript client uses 
            // FormData.append('fuelModel', JSON.stringify(fuelModel));
            resource = unmarshalJSON(entityStream, type);
            if (resource == null) {
                throw new WebApplicationException(Response.serverError().
                    entity("plain/text content is not valid JSON.").
                    type("text/plain").build());
            }
        } else {
            throw new WebApplicationException(Response.serverError().
                entity("Unsupported media type: " + mediaType.toString()).
                type("text/plain").build());
        }
        // Validate the model
        if (resource == null) {
            throw new WebApplicationException(Response.serverError().
                entity(lastError != null ? lastError.getMessage() : "Unknown error occurred.").
                type("text/plain").build());
        }
        return resource;
    }

    @SuppressWarnings("unchecked")
    private T unmarshalXML(InputStream entityStream, Class<T> type) {
        try {
            JAXBContext jaxbContext = JAXBContext.newInstance(type);
            return (T) jaxbContext.createUnmarshaller().unmarshal(entityStream);
        }
        catch (JAXBException ex) {
            lastError = ex;
            return null;
        }
    }

    private T unmarshalJSON(InputStream entityStream, Class<T> type) {
        try {
            JSONJAXBContext jaxbContext = new JSONJAXBContext(type);
            return jaxbContext.createJSONUnmarshaller().unmarshalFromJSON(entityStream, type);
        }
        catch (JAXBException ex) {
            lastError = ex;
            return null;
        }
    }
}
