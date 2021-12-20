// @ts-nocheck

sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("logaligroup.employees.controller.MainView", {
            onInit: function () {

            },
            onValidate: function() {
                let inputEmployee = this.byId("inputEmployee");
                let valueEmployee = inputEmployee.getValue();

                if (valueEmployee.length === 6) {
                    //inputEmployee.setDescription("OK");                    
                    this.byId("labelCountry").setVisible(true);
                    this.byId("slCountry").setVisible(true);
                } else {
                    //inputEmployee.setDescription("Not OK");
                    this.byId("labelCountry").setVisible(false);
                    this.byId("slCountry").setVisible(false);                    
                }
            }
        });
    });