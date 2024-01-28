import { AjaxForm } from "./AjaxForm.js";
import { AjaxTable } from "./AjaxTable.js";
import { AjaxNavigation } from "./AjaxNavigation.js";
import { AjaxModal } from "./AjaxModal.js";
import { PaginatedResult } from "./PaginatedResult.js";
import { Entity, ResponseType } from "./AjaxEntity.js";

interface AjaxListConfig {
    FormId: string;
    TableId: string;
    NavId: string;
    ModalIds: Array<string>;
    Entity: Entity;
}

export class AjaxList {
    form: AjaxForm;
    table: AjaxTable;
    navigation: AjaxNavigation;
    modals: Array<AjaxModal> = [];
    entity: Entity;

    private _result: PaginatedResult<ResponseType> | undefined;

    constructor(config: AjaxListConfig) {
        this.entity = config.Entity;

        this.form = new AjaxForm(config.FormId, this);
        this.table = new AjaxTable(config.TableId, this);
        this.navigation = new AjaxNavigation(config.NavId, this);
        
        config.ModalIds.forEach(modalId => {
            this.modals.push(new AjaxModal(modalId, this));
        });
    }

    get result() : PaginatedResult<ResponseType> | undefined {
        return this._result;
    }

    set result(value: PaginatedResult<ResponseType>) {
        this._result = value;

        this.table.Update();
        this.navigation.Update();
    }
}