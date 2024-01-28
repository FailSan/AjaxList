import { AjaxForm } from "./AjaxForm.js";
import { AjaxTable } from "./AjaxTable.js";
import { AjaxNavigation } from "./AjaxNavigation.js";
import { AjaxModal } from "./AjaxModal.js";
export class AjaxList {
    form;
    table;
    navigation;
    modals = [];
    entity;
    _result;
    constructor(config) {
        this.entity = config.Entity;
        this.form = new AjaxForm(config.FormId, this);
        this.table = new AjaxTable(config.TableId, this);
        this.navigation = new AjaxNavigation(config.NavId, this);
        config.ModalIds.forEach(modalId => {
            this.modals.push(new AjaxModal(modalId, this));
        });
    }
    get result() {
        return this._result;
    }
    set result(value) {
        this._result = value;
        this.table.Update();
        this.navigation.Update();
    }
}
