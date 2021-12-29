sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/employees/model/formatter"
], function (Controller, formatter) {

    function onInit() {
        this._bus = sap.ui.getCore().getEventBus();
    };

    function onCreateIncidence() {
        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index: index + 1 });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);
    };
    function onDeleteIncidence(oEvent) {
        var tableIncidence = this.getView().byId("tableIncidence");
        var rowIncidence = oEvent.getSource().getParent().getParent();
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var contextObj = rowIncidence.getBindingContext("incidenceModel");

        odata.splice(contextObj.index - 1, 1);
        for (var i in odata) {
            odata[i].index = parseInt(i) + 1;
        };

        incidenceModel.refresh();
        tableIncidence.removeContent(rowIncidence);

        for (var j in tableIncidence.getContent()){
            tableIncidence.getContent()[j].bindElement("incidenceModel>/"+j);
        }
    };
    function onSaveIncidence(oEvent) {
        var incidence = oEvent.getSource().getParent().getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });
    };

    function updateIncidenceCreationDate(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.CreationDateX = true;
    };

    function updateIncidenceReason(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.ReasonX = true;
    };

    function updateIncidenceType(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.TypeX = true;
    };

    var employeeDetail = Controller.extend("logaligroup.employees.controller.EmployeeDetails", {});
    employeeDetail.prototype.onInit = onInit;
    employeeDetail.prototype.onCreateIncidence = onCreateIncidence;
    employeeDetail.prototype.onDeleteIncidence = onDeleteIncidence;
    employeeDetail.prototype.Formatter = formatter;
    employeeDetail.prototype.onSaveIncidence = onSaveIncidence;

    employeeDetail.prototype.updateIncidenceCreationDate = updateIncidenceCreationDate;
    employeeDetail.prototype.updateIncidenceReason = updateIncidenceReason;
    employeeDetail.prototype.updateIncidenceType = updateIncidenceType;
    return employeeDetail;
}); 