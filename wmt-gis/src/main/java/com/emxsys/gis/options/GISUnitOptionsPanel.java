/*
 * Copyright (c) 2014, Bruce Schubert <bruce@emxsys.com>
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
package com.emxsys.gis.options;

import com.emxsys.gis.api.GisOptions;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.Enumeration;
import javax.swing.AbstractButton;

final class GISUnitOptionsPanel extends javax.swing.JPanel {

    private final GISUnitOptionsPanelController controller;
    private final ActionListener listener;

    GISUnitOptionsPanel(GISUnitOptionsPanelController controller) {
        this.controller = controller;
        this.listener = (ActionEvent e) -> {
            this.controller.changed();
        };
        initComponents();
        // listen to changes in form fields and call controller.changed()
        Enumeration<AbstractButton> areaButtons = buttonGroup1.getElements();
        while (areaButtons.hasMoreElements()) {
            areaButtons.nextElement().addActionListener(listener);            
        }
        Enumeration<AbstractButton> distButtons = buttonGroup2.getElements();
        while (distButtons.hasMoreElements()) {
            distButtons.nextElement().addActionListener(listener);            
        }
        Enumeration<AbstractButton> elevButtons = buttonGroup3.getElements();
        while (elevButtons.hasMoreElements()) {
            elevButtons.nextElement().addActionListener(listener);            
        }
    }

    /** This method is called from within the constructor to initialize the form. WARNING: Do NOT
     * modify this code. The content of this method is always regenerated by the Form Editor.
     */
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        buttonGroup1 = new javax.swing.ButtonGroup();
        buttonGroup2 = new javax.swing.ButtonGroup();
        buttonGroup3 = new javax.swing.ButtonGroup();
        descLabel = new javax.swing.JLabel();
        areaLabel = new javax.swing.JLabel();
        jPanel2 = new javax.swing.JPanel();
        acresButton = new javax.swing.JRadioButton();
        hectaresButton = new javax.swing.JRadioButton();
        distanceLabel = new javax.swing.JLabel();
        jPanel3 = new javax.swing.JPanel();
        chainsButton = new javax.swing.JRadioButton();
        feetButton = new javax.swing.JRadioButton();
        milesButton = new javax.swing.JRadioButton();
        metersButton = new javax.swing.JRadioButton();
        kilometersButton = new javax.swing.JRadioButton();
        elevationLabel = new javax.swing.JLabel();
        jPanel4 = new javax.swing.JPanel();
        feetElevButton = new javax.swing.JRadioButton();
        metersElevButton = new javax.swing.JRadioButton();

        org.openide.awt.Mnemonics.setLocalizedText(descLabel, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.descLabel.text")); // NOI18N
        descLabel.setVerticalAlignment(javax.swing.SwingConstants.TOP);

        org.openide.awt.Mnemonics.setLocalizedText(areaLabel, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.areaLabel.text")); // NOI18N

        jPanel2.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.LOWERED));

        buttonGroup1.add(acresButton);
        org.openide.awt.Mnemonics.setLocalizedText(acresButton, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.acresButton.text")); // NOI18N

        buttonGroup1.add(hectaresButton);
        org.openide.awt.Mnemonics.setLocalizedText(hectaresButton, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.hectaresButton.text")); // NOI18N

        javax.swing.GroupLayout jPanel2Layout = new javax.swing.GroupLayout(jPanel2);
        jPanel2.setLayout(jPanel2Layout);
        jPanel2Layout.setHorizontalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(acresButton, javax.swing.GroupLayout.DEFAULT_SIZE, 378, Short.MAX_VALUE)
                    .addComponent(hectaresButton, javax.swing.GroupLayout.DEFAULT_SIZE, 378, Short.MAX_VALUE)))
        );
        jPanel2Layout.setVerticalGroup(
            jPanel2Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel2Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(acresButton, javax.swing.GroupLayout.PREFERRED_SIZE, 18, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(hectaresButton)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        org.openide.awt.Mnemonics.setLocalizedText(distanceLabel, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.distanceLabel.text")); // NOI18N

        jPanel3.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.LOWERED));

        buttonGroup2.add(chainsButton);
        org.openide.awt.Mnemonics.setLocalizedText(chainsButton, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.chainsButton.text")); // NOI18N

        buttonGroup2.add(feetButton);
        org.openide.awt.Mnemonics.setLocalizedText(feetButton, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.feetButton.text")); // NOI18N

        buttonGroup2.add(milesButton);
        org.openide.awt.Mnemonics.setLocalizedText(milesButton, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.milesButton.text")); // NOI18N

        buttonGroup2.add(metersButton);
        org.openide.awt.Mnemonics.setLocalizedText(metersButton, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.metersButton.text")); // NOI18N

        buttonGroup2.add(kilometersButton);
        org.openide.awt.Mnemonics.setLocalizedText(kilometersButton, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.kilometersButton.text")); // NOI18N

        javax.swing.GroupLayout jPanel3Layout = new javax.swing.GroupLayout(jPanel3);
        jPanel3.setLayout(jPanel3Layout);
        jPanel3Layout.setHorizontalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel3Layout.createSequentialGroup()
                        .addComponent(chainsButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addContainerGap())
                    .addComponent(metersButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(feetButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(milesButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(kilometersButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
        );
        jPanel3Layout.setVerticalGroup(
            jPanel3Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel3Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(chainsButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(feetButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(milesButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(metersButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(kilometersButton)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        org.openide.awt.Mnemonics.setLocalizedText(elevationLabel, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.elevationLabel.text")); // NOI18N

        jPanel4.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.LOWERED));

        buttonGroup3.add(feetElevButton);
        org.openide.awt.Mnemonics.setLocalizedText(feetElevButton, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.feetElevButton.text")); // NOI18N

        buttonGroup3.add(metersElevButton);
        org.openide.awt.Mnemonics.setLocalizedText(metersElevButton, org.openide.util.NbBundle.getMessage(GISUnitOptionsPanel.class, "GISUnitOptionsPanel.metersElevButton.text")); // NOI18N

        javax.swing.GroupLayout jPanel4Layout = new javax.swing.GroupLayout(jPanel4);
        jPanel4.setLayout(jPanel4Layout);
        jPanel4Layout.setHorizontalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(jPanel4Layout.createSequentialGroup()
                        .addComponent(feetElevButton, javax.swing.GroupLayout.DEFAULT_SIZE, 372, Short.MAX_VALUE)
                        .addContainerGap())
                    .addComponent(metersElevButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
        );
        jPanel4Layout.setVerticalGroup(
            jPanel4Layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(jPanel4Layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(feetElevButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(metersElevButton)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(descLabel, javax.swing.GroupLayout.DEFAULT_SIZE, 390, Short.MAX_VALUE)
                    .addComponent(jPanel2, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(areaLabel, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(distanceLabel, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel3, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(elevationLabel, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(jPanel4, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(descLabel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(areaLabel)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel2, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(distanceLabel)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel3, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(elevationLabel)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(jPanel4, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
    }// </editor-fold>//GEN-END:initComponents

    void load() {
        // read settings and initialize GUI
        switch (GisOptions.getAreaUom()) {
            case GisOptions.UOM_ACRES:
                acresButton.setSelected(true);
                break;
            case GisOptions.UOM_HECTARES:
                hectaresButton.setSelected(true);
                break;
        }
        switch (GisOptions.getDistanceUom()) {
            case GisOptions.UOM_CHAINS:
                chainsButton.setSelected(true);
                break;
            case GisOptions.UOM_FEET:
                feetButton.setSelected(true);
                break;
            case GisOptions.UOM_MILES:
                milesButton.setSelected(true);
                break;
            case GisOptions.UOM_METERS:
                metersButton.setSelected(true);
                break;
            case GisOptions.UOM_KILOMETERS:
                kilometersButton.setSelected(true);
                break;
        }
        switch (GisOptions.getElevationUom()) {
            case GisOptions.UOM_FEET:
                feetElevButton.setSelected(true);
                break;
            case GisOptions.UOM_METERS:
                metersElevButton.setSelected(true);
                break;
        }
    }

    void store() {
        // store modified settings 
        // Area
        if (acresButton.isSelected()) {
            GisOptions.setAreaUom(GisOptions.UOM_ACRES);
        } else if (hectaresButton.isSelected()) {
            GisOptions.setAreaUom(GisOptions.UOM_HECTARES);
        }
        // Distance
        if (chainsButton.isSelected()) {
            GisOptions.setDistanceUom(GisOptions.UOM_CHAINS);
        } else if (feetButton.isSelected()) {
            GisOptions.setDistanceUom(GisOptions.UOM_FEET);
        } else if (milesButton.isSelected()) {
            GisOptions.setDistanceUom(GisOptions.UOM_MILES);
        } else if (metersButton.isSelected()) {
            GisOptions.setDistanceUom(GisOptions.UOM_METERS);
        } else if (kilometersButton.isSelected()) {
            GisOptions.setDistanceUom(GisOptions.UOM_KILOMETERS);
        }
        // Elevation
        if (feetElevButton.isSelected()) {
            GisOptions.setElevationUom(GisOptions.UOM_FEET);
        } else if (metersElevButton.isSelected()) {
            GisOptions.setElevationUom(GisOptions.UOM_METERS);
        }
    }

    boolean valid() {
        // TODO check whether form is consistent and complete
        return true;
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JRadioButton acresButton;
    private javax.swing.JLabel areaLabel;
    private javax.swing.ButtonGroup buttonGroup1;
    private javax.swing.ButtonGroup buttonGroup2;
    private javax.swing.ButtonGroup buttonGroup3;
    private javax.swing.JRadioButton chainsButton;
    private javax.swing.JLabel descLabel;
    private javax.swing.JLabel distanceLabel;
    private javax.swing.JLabel elevationLabel;
    private javax.swing.JRadioButton feetButton;
    private javax.swing.JRadioButton feetElevButton;
    private javax.swing.JRadioButton hectaresButton;
    private javax.swing.JPanel jPanel2;
    private javax.swing.JPanel jPanel3;
    private javax.swing.JPanel jPanel4;
    private javax.swing.JRadioButton kilometersButton;
    private javax.swing.JRadioButton metersButton;
    private javax.swing.JRadioButton metersElevButton;
    private javax.swing.JRadioButton milesButton;
    // End of variables declaration//GEN-END:variables
}