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
package com.emxsys.wildfire.options;

import com.emxsys.wildfire.api.WildfirePreferences;
import static com.emxsys.wildfire.api.WildfirePreferences.UOM_BTU_PER_FOOT_PER_SEC;
import static com.emxsys.wildfire.api.WildfirePreferences.UOM_BTU_PER_FT2;
import static com.emxsys.wildfire.api.WildfirePreferences.UOM_CHAINS;
import static com.emxsys.wildfire.api.WildfirePreferences.UOM_FOOT;
import static com.emxsys.wildfire.api.WildfirePreferences.UOM_KJ_PER_M2;
import static com.emxsys.wildfire.api.WildfirePreferences.UOM_KPH;
import static com.emxsys.wildfire.api.WildfirePreferences.UOM_KW_PER_METER;
import static com.emxsys.wildfire.api.WildfirePreferences.UOM_METER;
import static com.emxsys.wildfire.api.WildfirePreferences.UOM_MPH;
import static com.emxsys.wildfire.api.WildfirePreferences.UOM_MPS;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

final class WildfireUnitsOptionsPanel extends javax.swing.JPanel {

    private final WildfireUnitsOptionsPanelController controller;
    private final ActionListener listener;

    WildfireUnitsOptionsPanel(WildfireUnitsOptionsPanelController controller) {
        this.controller = controller;
        this.listener = (ActionEvent e) -> {
            this.controller.changed();
        };
        initComponents();
        // listen to changes in form fields and call controller.changed()
        this.chainsButton.addActionListener(listener);
        this.mphButton.addActionListener(listener);
        this.kphButton.addActionListener(listener);
        this.mpsButton.addActionListener(listener);
    }

    /** This method is called from within the constructor to initialize the form. WARNING: Do NOT
     * modify this code. The content of this method is always regenerated by the Form Editor.
     */
    // <editor-fold defaultstate="collapsed" desc="Generated Code">//GEN-BEGIN:initComponents
    private void initComponents() {

        rosButtonGroup = new javax.swing.ButtonGroup();
        flnButtonGroup = new javax.swing.ButtonGroup();
        fliButtonGroup = new javax.swing.ButtonGroup();
        heatButtonGroup = new javax.swing.ButtonGroup();
        descLabel = new javax.swing.JLabel();
        rosLabel = new javax.swing.JLabel();
        rosPanel = new javax.swing.JPanel();
        chainsButton = new javax.swing.JRadioButton();
        mphButton = new javax.swing.JRadioButton();
        kphButton = new javax.swing.JRadioButton();
        mpsButton = new javax.swing.JRadioButton();
        flnLabel = new javax.swing.JLabel();
        flnPanel = new javax.swing.JPanel();
        feetButton = new javax.swing.JRadioButton();
        metersButton = new javax.swing.JRadioButton();
        heatLabel = new javax.swing.JLabel();
        heatPanel = new javax.swing.JPanel();
        heatBtuButton = new javax.swing.JRadioButton();
        heatKjButton = new javax.swing.JRadioButton();
        fliLabel = new javax.swing.JLabel();
        fliPanel = new javax.swing.JPanel();
        fliBtuButton = new javax.swing.JRadioButton();
        fliKwButton = new javax.swing.JRadioButton();

        org.openide.awt.Mnemonics.setLocalizedText(descLabel, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.descLabel.text")); // NOI18N
        descLabel.setVerticalAlignment(javax.swing.SwingConstants.TOP);

        org.openide.awt.Mnemonics.setLocalizedText(rosLabel, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.rosLabel.text")); // NOI18N

        rosPanel.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.LOWERED));

        rosButtonGroup.add(chainsButton);
        org.openide.awt.Mnemonics.setLocalizedText(chainsButton, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.chainsButton.text")); // NOI18N

        rosButtonGroup.add(mphButton);
        org.openide.awt.Mnemonics.setLocalizedText(mphButton, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.mphButton.text")); // NOI18N

        rosButtonGroup.add(kphButton);
        org.openide.awt.Mnemonics.setLocalizedText(kphButton, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.kphButton.text")); // NOI18N

        rosButtonGroup.add(mpsButton);
        org.openide.awt.Mnemonics.setLocalizedText(mpsButton, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.mpsButton.text")); // NOI18N

        javax.swing.GroupLayout rosPanelLayout = new javax.swing.GroupLayout(rosPanel);
        rosPanel.setLayout(rosPanelLayout);
        rosPanelLayout.setHorizontalGroup(
            rosPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(rosPanelLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(rosPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addGroup(rosPanelLayout.createSequentialGroup()
                        .addComponent(chainsButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                        .addContainerGap())
                    .addComponent(mpsButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(mphButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(kphButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)))
        );
        rosPanelLayout.setVerticalGroup(
            rosPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(rosPanelLayout.createSequentialGroup()
                .addComponent(chainsButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(mphButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(kphButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(mpsButton))
        );

        org.openide.awt.Mnemonics.setLocalizedText(flnLabel, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.flnLabel.text")); // NOI18N

        flnPanel.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.LOWERED));

        flnButtonGroup.add(feetButton);
        org.openide.awt.Mnemonics.setLocalizedText(feetButton, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.feetButton.text")); // NOI18N

        flnButtonGroup.add(metersButton);
        org.openide.awt.Mnemonics.setLocalizedText(metersButton, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.metersButton.text")); // NOI18N

        javax.swing.GroupLayout flnPanelLayout = new javax.swing.GroupLayout(flnPanel);
        flnPanel.setLayout(flnPanelLayout);
        flnPanelLayout.setHorizontalGroup(
            flnPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(flnPanelLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(flnPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(feetButton, javax.swing.GroupLayout.DEFAULT_SIZE, 329, Short.MAX_VALUE)
                    .addComponent(metersButton, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, 329, Short.MAX_VALUE))
                .addContainerGap())
        );
        flnPanelLayout.setVerticalGroup(
            flnPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(flnPanelLayout.createSequentialGroup()
                .addComponent(feetButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(metersButton)
                .addContainerGap())
        );

        org.openide.awt.Mnemonics.setLocalizedText(heatLabel, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.heatLabel.text")); // NOI18N

        heatPanel.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.LOWERED));

        heatButtonGroup.add(heatBtuButton);
        org.openide.awt.Mnemonics.setLocalizedText(heatBtuButton, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.heatBtuButton.text")); // NOI18N

        heatButtonGroup.add(heatKjButton);
        org.openide.awt.Mnemonics.setLocalizedText(heatKjButton, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.heatKjButton.text")); // NOI18N

        javax.swing.GroupLayout heatPanelLayout = new javax.swing.GroupLayout(heatPanel);
        heatPanel.setLayout(heatPanelLayout);
        heatPanelLayout.setHorizontalGroup(
            heatPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(heatPanelLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(heatPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(heatKjButton, javax.swing.GroupLayout.DEFAULT_SIZE, 329, Short.MAX_VALUE)
                    .addComponent(heatBtuButton, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap())
        );
        heatPanelLayout.setVerticalGroup(
            heatPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(heatPanelLayout.createSequentialGroup()
                .addComponent(heatBtuButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(heatKjButton))
        );

        org.openide.awt.Mnemonics.setLocalizedText(fliLabel, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.fliLabel.text")); // NOI18N

        fliPanel.setBorder(new javax.swing.border.SoftBevelBorder(javax.swing.border.BevelBorder.LOWERED));

        fliButtonGroup.add(fliBtuButton);
        org.openide.awt.Mnemonics.setLocalizedText(fliBtuButton, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.fliBtuButton.text")); // NOI18N

        fliButtonGroup.add(fliKwButton);
        org.openide.awt.Mnemonics.setLocalizedText(fliKwButton, org.openide.util.NbBundle.getMessage(WildfireUnitsOptionsPanel.class, "WildfireUnitsOptionsPanel.fliKwButton.text")); // NOI18N

        javax.swing.GroupLayout fliPanelLayout = new javax.swing.GroupLayout(fliPanel);
        fliPanel.setLayout(fliPanelLayout);
        fliPanelLayout.setHorizontalGroup(
            fliPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(fliPanelLayout.createSequentialGroup()
                .addContainerGap()
                .addGroup(fliPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(fliBtuButton, javax.swing.GroupLayout.DEFAULT_SIZE, 329, Short.MAX_VALUE)
                    .addComponent(fliKwButton, javax.swing.GroupLayout.DEFAULT_SIZE, 329, Short.MAX_VALUE))
                .addContainerGap())
        );
        fliPanelLayout.setVerticalGroup(
            fliPanelLayout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(fliPanelLayout.createSequentialGroup()
                .addComponent(fliBtuButton)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(fliKwButton))
        );

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addGroup(layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                    .addComponent(descLabel, javax.swing.GroupLayout.DEFAULT_SIZE, 347, Short.MAX_VALUE)
                    .addComponent(rosPanel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(rosLabel, javax.swing.GroupLayout.Alignment.TRAILING, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(flnPanel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(flnLabel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(heatLabel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(heatPanel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(fliLabel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE)
                    .addComponent(fliPanel, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
                .addContainerGap())
        );
        layout.setVerticalGroup(
            layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
            .addGroup(layout.createSequentialGroup()
                .addContainerGap()
                .addComponent(descLabel, javax.swing.GroupLayout.PREFERRED_SIZE, 28, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(rosLabel)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(rosPanel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(flnLabel)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(flnPanel, javax.swing.GroupLayout.PREFERRED_SIZE, 48, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.UNRELATED)
                .addComponent(heatLabel)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(heatPanel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(fliLabel)
                .addPreferredGap(javax.swing.LayoutStyle.ComponentPlacement.RELATED)
                .addComponent(fliPanel, javax.swing.GroupLayout.PREFERRED_SIZE, javax.swing.GroupLayout.DEFAULT_SIZE, javax.swing.GroupLayout.PREFERRED_SIZE)
                .addContainerGap(javax.swing.GroupLayout.DEFAULT_SIZE, Short.MAX_VALUE))
        );
    }// </editor-fold>//GEN-END:initComponents

    void load() {
        // read settings and initialize GUI
        switch (WildfirePreferences.getRateOfSpreadUom()) {
            case UOM_CHAINS:
                this.chainsButton.setSelected(true);
                break;
            case UOM_MPH:
                this.mphButton.setSelected(true);
                break;
            case UOM_MPS:
                this.mpsButton.setSelected(true);
                break;
            case UOM_KPH:
                this.kphButton.setSelected(true);
                break;
        }
        switch (WildfirePreferences.getFlameLengthUom()) {
            case UOM_FOOT:
                this.feetButton.setSelected(true);
                break;
            case UOM_METER:
                this.metersButton.setSelected(true);
                break;
        }
        switch (WildfirePreferences.getHeatReleaseUom()) {
            case UOM_KJ_PER_M2:
                this.heatKjButton.setSelected(true);
                break;
            case UOM_BTU_PER_FT2:
                this.heatBtuButton.setSelected(true);
                break;
        }
        switch (WildfirePreferences.getByramsIntensityUom()) {
            case UOM_KW_PER_METER:
                this.fliKwButton.setSelected(true);
                break;
            case UOM_BTU_PER_FOOT_PER_SEC:
                this.fliBtuButton.setSelected(true);
                break;
        }
    }

    void store() {
        // store modified settings
        // ROS
        if (this.mphButton.isSelected()) {
            WildfirePreferences.setRateOfSpread(UOM_MPH);
        } else if (this.kphButton.isSelected()) {
            WildfirePreferences.setRateOfSpread(UOM_KPH);
        } else if (this.chainsButton.isSelected()) {
            WildfirePreferences.setRateOfSpread(UOM_CHAINS);
        } else if (this.mpsButton.isSelected()) {
            WildfirePreferences.setRateOfSpread(UOM_MPS);
        }
        // FLN
        if (this.feetButton.isSelected()) {
            WildfirePreferences.setFlameLengthUom(UOM_FOOT);
        } else if (this.metersButton.isSelected()) {
            WildfirePreferences.setFlameLengthUom(UOM_METER);
        }
        // HEAT
        if (this.heatKjButton.isSelected()) {
            WildfirePreferences.setHeatReleaseUom(UOM_KJ_PER_M2);
        } else if (this.heatBtuButton.isSelected()) {
            WildfirePreferences.setHeatReleaseUom(UOM_BTU_PER_FT2);
        }
        // FLI
        if (this.fliKwButton.isSelected()) {
            WildfirePreferences.setByramsIntensityUom(UOM_KW_PER_METER);
        } else if (this.fliBtuButton.isSelected()) {
            WildfirePreferences.setByramsIntensityUom(UOM_BTU_PER_FOOT_PER_SEC);
        }
    }

    boolean valid() {
        // TODO check whether form is consistent and complete
        return true;
    }

    // Variables declaration - do not modify//GEN-BEGIN:variables
    private javax.swing.JRadioButton chainsButton;
    private javax.swing.JLabel descLabel;
    private javax.swing.JRadioButton feetButton;
    private javax.swing.JRadioButton fliBtuButton;
    private javax.swing.ButtonGroup fliButtonGroup;
    private javax.swing.JRadioButton fliKwButton;
    private javax.swing.JLabel fliLabel;
    private javax.swing.JPanel fliPanel;
    private javax.swing.ButtonGroup flnButtonGroup;
    private javax.swing.JLabel flnLabel;
    private javax.swing.JPanel flnPanel;
    private javax.swing.JRadioButton heatBtuButton;
    private javax.swing.ButtonGroup heatButtonGroup;
    private javax.swing.JRadioButton heatKjButton;
    private javax.swing.JLabel heatLabel;
    private javax.swing.JPanel heatPanel;
    private javax.swing.JRadioButton kphButton;
    private javax.swing.JRadioButton metersButton;
    private javax.swing.JRadioButton mphButton;
    private javax.swing.JRadioButton mpsButton;
    private javax.swing.ButtonGroup rosButtonGroup;
    private javax.swing.JLabel rosLabel;
    private javax.swing.JPanel rosPanel;
    // End of variables declaration//GEN-END:variables
}
