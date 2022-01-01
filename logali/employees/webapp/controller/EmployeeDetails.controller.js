sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "logaligroup/employees/model/formatter",
    "sap/m/MessageBox"
], function (Controller, formatter, MessageBox) {

    function onInit() {
        this._bus = sap.ui.getCore().getEventBus();
    };

    function onCreateIncidence() {
        var tableIncidence = this.getView().byId("tableIncidence");
        var newIncidence = sap.ui.xmlfragment("logaligroup.employees.fragment.NewIncidence", this);
        var incidenceModel = this.getView().getModel("incidenceModel");
        var odata = incidenceModel.getData();
        var index = odata.length;
        odata.push({ index: index + 1,  _ValidateDate: false });
        incidenceModel.refresh();
        newIncidence.bindElement("incidenceModel>/" + index);
        tableIncidence.addContent(newIncidence);
    };
    function onDeleteIncidence(oEvent) {

        var contexjObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();

        MessageBox.confirm(this.getView().getModel("i18n").getResourceBundle().getText("confirmDeleteIncidence"), {
            onClose: function (oAction) {

                if (oAction === "OK") {
                    this._bus.publish("incidence", "onDeleteIncidence", {
                        IncidenceId: contexjObj.IncidenceId,
                        SapId: contexjObj.SapId,
                        EmployeeId: contexjObj.EmployeeId
                    });
                }
                
            }.bind(this)
        });
    };
       
    function onSaveIncidence(oEvent) {
        var incidence = oEvent.getSource().getParent().getParent();
        var incidenceRow = incidence.getBindingContext("incidenceModel");
        this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') });
    };

    function updateIncidenceCreationDate(oEvent) {
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();
        let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

        if (!oEvent.getSource().isValidValue()) {
            contextObj._ValidateDate = false;
            contextObj.CreationDateState = "Error";
            MessageBox.error(oResourceBundle.getText("errorCreationDateValue"), {
                title: "Error",
                onClose: null,
                styleClass: "",
                actions: MessageBox.Action.Close,
                emphasizedAction: null,
                initialFocus: null,
                textDirection: sap.ui.core.TextDirection.Inherit
            });
        } else {
            contextObj.CreationDateX = true;
            contextObj._ValidateDate = true;
            contextObj.CreationDateState = "None";
        };
        if (oEvent.getSource().isValidValue() && contextObj.Reason) {
            contextObj.EnabledSave = true;
        } else {
            contextObj.EnabledSave = false;
        };

        context.getModel().refresh();
    };

    function updateIncidenceReason(oEvent) {
        let context = oEvent.getSource().getBindingContext("incidenceModel");
        let contextObj = context.getObject();

        if (oEvent.getSource().getValue()) {
            contextObj.ReasonX = true;
            contextObj.ReasonState = "None";
        } else {
            contextObj.ReasonState = "Error";

            MessageBox.error(oResourceBundle.getText("errorIncidenceReason"), {
                title: "Error",
                onClose: null,
                styleClass: "",
                actions: MessageBox.Action.Close,
                emphasizedAction: null,
                initialFocus: null,
                textDirection: sap.ui.core.TextDirection.Inherit
            });

        };      

        if (contextObj._ValidateDate && oEvent.getSource().getValue()) {
            contextObj.EnabledSave = true;
        } else {
            contextObj.EnabledSave = false;
        };
        context.getModel().refresh();
    };

    function updateIncidenceType(oEvent) {
        var context = oEvent.getSource().getBindingContext("incidenceModel");
        var contextObj = context.getObject();
        contextObj.TypeX = true;
    };

    function toOrderDetails(oEvent) {
        var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
        var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        oRouter.navTo("RouteOrderDetails", {
            OrderID : orderID
        });
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
    employeeDetail.prototype.toOrderDetails = toOrderDetails;

    return employeeDetail;
}); 