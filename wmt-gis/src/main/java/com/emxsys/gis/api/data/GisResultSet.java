/*
 * Copyright (c) 2010-2012, Bruce Schubert. <bruce@emxsys.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * - Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * - Neither the name of Bruce Schubert, Emxsys nor the names of its 
 *   contributors may be used to endorse or promote products derived
 *   from this software without specific prior written permission.
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
package com.emxsys.gis.api.data;

import com.emxsys.gis.api.Box;
import com.emxsys.gis.api.Geometry;
import java.io.InputStream;
import java.io.Reader;
import java.math.BigDecimal;
import java.net.URL;
import java.sql.Array;
import java.sql.Blob;
import java.sql.Clob;
import java.sql.Date;
import java.sql.NClob;
import java.sql.Ref;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.RowId;
import java.sql.SQLException;
import java.sql.SQLWarning;
import java.sql.SQLXML;
import java.sql.Statement;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Map;

/**
 *
 * @author Bruce Schubert <bruce@emxsys.com>
 */
public abstract class GisResultSet implements ResultSet {

    abstract public Geometry getFeature() throws SQLException;

    abstract public Box getBounds();

    @Override
    abstract public String getCursorName() throws SQLException;

    @Override
    abstract public boolean next() throws SQLException;

    @Override
    abstract public String getString(int columnIndex) throws SQLException;

    @Override
    abstract public boolean getBoolean(int columnIndex) throws SQLException;

    @Override
    abstract public long getLong(int columnIndex) throws SQLException;

    @Override
    abstract public double getDouble(int columnIndex) throws SQLException;

    @Override
    public Date getDate(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    abstract public String getString(String columnLabel) throws SQLException;

    @Override
    abstract public boolean getBoolean(String columnLabel) throws SQLException;

    @Override
    abstract public long getLong(String columnLabel) throws SQLException;

    @Override
    abstract public double getDouble(String columnLabel) throws SQLException;

    @Override
    abstract public ResultSetMetaData getMetaData() throws SQLException;

    @Override
    abstract public Object getObject(int columnIndex) throws SQLException;

    @Override
    abstract public Object getObject(String columnLabel) throws SQLException;

    @Override
    abstract public int findColumn(String columnLabel) throws SQLException;

    @Override
    abstract public boolean isBeforeFirst() throws SQLException;

    @Override
    abstract public boolean isAfterLast() throws SQLException;

    @Override
    abstract public boolean isFirst() throws SQLException;

    @Override
    abstract public boolean isLast() throws SQLException;

    @Override
    abstract public void beforeFirst() throws SQLException;

    @Override
    abstract public void afterLast() throws SQLException;

    @Override
    abstract public boolean first() throws SQLException;

    @Override
    abstract public boolean last() throws SQLException;

    @Override
    abstract public int getRow() throws SQLException;

    @Override
    abstract public boolean absolute(int row) throws SQLException;

    @Override
    abstract public boolean relative(int rows) throws SQLException;

    @Override
    abstract public boolean previous() throws SQLException;

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void close() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public boolean wasNull() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public byte getByte(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public short getShort(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public int getInt(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public float getFloat(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    @Deprecated
    public BigDecimal getBigDecimal(int columnIndex, int scale) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public byte[] getBytes(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public Time getTime(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public Timestamp getTimestamp(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public InputStream getAsciiStream(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    @Deprecated
    public InputStream getUnicodeStream(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public InputStream getBinaryStream(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public byte getByte(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public short getShort(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public int getInt(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public float getFloat(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    @Deprecated
    public BigDecimal getBigDecimal(String columnLabel, int scale) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public byte[] getBytes(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public Date getDate(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public Time getTime(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public Timestamp getTimestamp(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public InputStream getAsciiStream(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    @Deprecated
    public InputStream getUnicodeStream(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public InputStream getBinaryStream(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public SQLWarning getWarnings() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void clearWarnings() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public Reader getCharacterStream(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public Reader getCharacterStream(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public BigDecimal getBigDecimal(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public BigDecimal getBigDecimal(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void setFetchDirection(int direction) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public int getFetchDirection() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void setFetchSize(int rows) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public int getFetchSize() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public int getType() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public int getConcurrency() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public boolean rowUpdated() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public boolean rowInserted() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public boolean rowDeleted() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateNull(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateBoolean(int columnIndex, boolean x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateByte(int columnIndex, byte x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateShort(int columnIndex, short x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateInt(int columnIndex, int x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateLong(int columnIndex, long x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateFloat(int columnIndex, float x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateDouble(int columnIndex, double x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateBigDecimal(int columnIndex, BigDecimal x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateString(int columnIndex, String x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateBytes(int columnIndex, byte[] x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateDate(int columnIndex, Date x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateTime(int columnIndex, Time x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateTimestamp(int columnIndex, Timestamp x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateAsciiStream(int columnIndex, InputStream x, int length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateBinaryStream(int columnIndex, InputStream x, int length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateCharacterStream(int columnIndex, Reader x, int length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateObject(int columnIndex, Object x, int scaleOrLength) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateObject(int columnIndex, Object x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateNull(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateBoolean(String columnLabel, boolean x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateByte(String columnLabel, byte x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateShort(String columnLabel, short x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateInt(String columnLabel, int x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateLong(String columnLabel, long x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateFloat(String columnLabel, float x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateDouble(String columnLabel, double x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateBigDecimal(String columnLabel, BigDecimal x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateString(String columnLabel, String x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateBytes(String columnLabel, byte[] x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateDate(String columnLabel, Date x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateTime(String columnLabel, Time x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateTimestamp(String columnLabel, Timestamp x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateAsciiStream(String columnLabel, InputStream x, int length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateBinaryStream(String columnLabel, InputStream x, int length) throws
            SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateCharacterStream(String columnLabel, Reader reader, int length) throws
            SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateObject(String columnLabel, Object x, int scaleOrLength) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateObject(String columnLabel, Object x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void insertRow() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void updateRow() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void deleteRow() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void refreshRow() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void cancelRowUpdates() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void moveToInsertRow() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public void moveToCurrentRow() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not implemented.
     *
     * @throws SQLException
     */
    @Override
    public Statement getStatement() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Object getObject(int columnIndex,
                            Map<String, Class<?>> map) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Ref getRef(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Blob getBlob(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Clob getClob(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Array getArray(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Object getObject(String columnLabel,
                            Map<String, Class<?>> map) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Ref getRef(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Blob getBlob(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Clob getClob(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Array getArray(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Date getDate(int columnIndex, Calendar cal) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Date getDate(String columnLabel, Calendar cal) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Time getTime(int columnIndex, Calendar cal) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Time getTime(String columnLabel, Calendar cal) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Timestamp getTimestamp(int columnIndex, Calendar cal) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Timestamp getTimestamp(String columnLabel, Calendar cal) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public URL getURL(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public URL getURL(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateRef(int columnIndex, Ref x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateRef(String columnLabel, Ref x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateBlob(int columnIndex, Blob x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateBlob(String columnLabel, Blob x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateClob(int columnIndex, Clob x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateClob(String columnLabel, Clob x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateArray(int columnIndex, Array x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateArray(String columnLabel, Array x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public RowId getRowId(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public RowId getRowId(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateRowId(int columnIndex, RowId x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateRowId(String columnLabel, RowId x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public int getHoldability() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public boolean isClosed() throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNString(int columnIndex, String nString) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNString(String columnLabel, String nString) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNClob(int columnIndex, NClob nClob) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNClob(String columnLabel, NClob nClob) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public NClob getNClob(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public NClob getNClob(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public SQLXML getSQLXML(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public SQLXML getSQLXML(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateSQLXML(int columnIndex, SQLXML xmlObject) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateSQLXML(String columnLabel, SQLXML xmlObject) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public String getNString(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public String getNString(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Reader getNCharacterStream(int columnIndex) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public Reader getNCharacterStream(String columnLabel) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNCharacterStream(int columnIndex, Reader x, long length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNCharacterStream(String columnLabel, Reader reader, long length) throws
            SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateAsciiStream(int columnIndex, InputStream x, long length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateBinaryStream(int columnIndex, InputStream x, long length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateCharacterStream(int columnIndex, Reader x, long length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateAsciiStream(String columnLabel, InputStream x, long length) throws
            SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateBinaryStream(String columnLabel, InputStream x, long length) throws
            SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateCharacterStream(String columnLabel, Reader reader, long length) throws
            SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateBlob(int columnIndex, InputStream inputStream, long length) throws
            SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateBlob(String columnLabel, InputStream inputStream, long length) throws
            SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateClob(int columnIndex, Reader reader, long length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateClob(String columnLabel, Reader reader, long length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNClob(int columnIndex, Reader reader, long length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNClob(String columnLabel, Reader reader, long length) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNCharacterStream(int columnIndex, Reader x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNCharacterStream(String columnLabel, Reader reader) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateAsciiStream(int columnIndex, InputStream x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateBinaryStream(int columnIndex, InputStream x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateCharacterStream(int columnIndex, Reader x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateAsciiStream(String columnLabel, InputStream x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateBinaryStream(String columnLabel, InputStream x) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateCharacterStream(String columnLabel, Reader reader) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateBlob(int columnIndex, InputStream inputStream) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateBlob(String columnLabel, InputStream inputStream) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateClob(int columnIndex, Reader reader) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateClob(String columnLabel, Reader reader) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNClob(int columnIndex, Reader reader) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public void updateNClob(String columnLabel, Reader reader) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public <T> T unwrap(Class<T> iface) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    /**
     * Not Implemented
     */
    @Override
    public boolean isWrapperFor(Class<?> iface) throws SQLException {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
