import { Entity, ResponseType } from "./AjaxEntity.js";
import { AjaxList } from "./AjaxList.js";
import { Announcement, Slot } from "./Announcement.js";

export interface ColumnSettings {
    Label: string;
}

export interface PropertyColumnSettings extends ColumnSettings {
    Property: string;
}

export interface ActionColumnSettings extends ColumnSettings {
    Action: "modal" | "link" | "postback";
    Method: "detail" | "publish" | "refuse" | "archive";
    ActionUrl: string;
    ModalId: string;
}

export class AjaxTable {
    parentList: AjaxList;
    container: HTMLTableElement;
    body: HTMLTableSectionElement;
    private _columns: Array<ColumnSettings> = [];

    constructor(tableId: string, parentList: AjaxList) {
        this.parentList = parentList;
        this.container = document.querySelector(tableId) as HTMLTableElement;
        this.body = this.container.querySelector("tbody") as HTMLTableSectionElement;
        this.columns = this.container.querySelectorAll("thead th") as NodeListOf<HTMLElement>;
    }

    private set columns(htmlColumns: NodeListOf<HTMLElement>) {
        htmlColumns.forEach(column => {
            var columnSetting: ColumnSettings;
            var action = column.dataset.action;

            if (action) {
                columnSetting = {
                    Label: column.textContent ? column.textContent : "",
                    Action: column.dataset.action ? column.dataset.action : "",
                    ActionUrl: column.dataset.actionUrl ? column.dataset.actionUrl : "",
                    Method: column.dataset.method ? column.dataset.method : "",
                    ModalId: column.dataset.modalId ? column.dataset.modalId : "",
                } as ActionColumnSettings;
            }

            else {
                columnSetting = {
                    Label: column.textContent ? column.textContent : "",
                    Property: column.dataset.property ? column.dataset.property : ""
                } as PropertyColumnSettings;
            }
            
            this._columns.push(columnSetting);
        });
    }

    Update() {
        this.body.innerHTML = "";

        var results = this.parentList.result?.Items;
        if (results?.length == 0)
            this.AddEmptyRow();
        else
            for(let row of results!)
                this.AddRow(row);
    }

    AddEmptyRow() {
        var newRow = document.createElement("tr");
        var newCell = document.createElement("td");
        newCell.classList.add("w-100", "text-center");
        newCell.colSpan = this._columns.length;
        newCell.textContent = "No Elements in the Collection";

        newRow.appendChild(newCell);
        this.body.appendChild(newRow);
    }

    AddRow(rowData: ResponseType) {
        var newRow = document.createElement("tr");
        switch(this.parentList.entity) {
            case Entity.Announcement:
                var announcement = rowData as Announcement;
                newRow = this.BuildAnnouncementRow(newRow, announcement);
                break;

            case Entity.Reservation:
                var reservation = rowData as Slot;
                newRow = this.BuildReservationRow(newRow, reservation);
                break;
        }

        this.body.appendChild(newRow);
    }

    BuildAnnouncementRow(row: HTMLTableRowElement, announcement: Announcement) : HTMLTableRowElement {
        this._columns.filter((column): column is PropertyColumnSettings => {
            return (column as ActionColumnSettings).Action === undefined;
        }).forEach(x => this.BuildAnnouncementPropertyCell(row, x, announcement));

        this._columns.filter((column): column is ActionColumnSettings => {
            return (column as ActionColumnSettings).Action !== undefined;
        }).forEach(x => this.BuildActionCell(row, x, announcement));

        return row;
    }

    BuildReservationRow(row: HTMLTableRowElement, reservation: Slot) : HTMLTableRowElement {
        this._columns.filter((column): column is PropertyColumnSettings => {
            return (column as ActionColumnSettings).Action === undefined;
        }).forEach(x => this.BuildReservationPropertyCell(row, x, reservation));

        this._columns.filter((column): column is ActionColumnSettings => {
            return (column as ActionColumnSettings).Action !== undefined;
        }).forEach(x => this.BuildActionCell(row, x, reservation));

        return row;
    }

    BuildReservationPropertyCell(row: HTMLTableRowElement, column: PropertyColumnSettings, reservation: Slot) {
        var newCell = document.createElement("td");
        var textContent: string;

        switch(column.Property.toLowerCase()) {
            case "id":
                newCell = document.createElement("th");
                newCell.scope = "row";
                textContent = reservation.Id.toString();
                break;

            case "typology":
                textContent = reservation.Typology;
                break;

            case "reservation":
                var firstName = reservation.Reservation?.ReservedBy.FirstName;
                var lastName = reservation.Reservation?.ReservedBy.LastName;
                var date = reservation.Date;
                var hour = reservation.Start;
                textContent = `${firstName} ${lastName} - ${date} - ${hour}`;
                break;
            
            default:
                textContent = "-";
        }

        newCell.textContent = textContent;
        newCell.classList.add("align-middle");

        row.appendChild(newCell);
    }

    BuildActionCell(row: HTMLTableRowElement, column: ActionColumnSettings, response: ResponseType) {
        var newCell = document.createElement("td");
        
        var newButton;
        switch(column.Action) {
            case "modal":
                newButton = document.createElement("button");
                newButton.type = "button";
                newButton.dataset.bsToggle = "modal";
                newButton.dataset.bsTarget = column.ModalId;
                newButton.addEventListener("click", () => {
                    let targetModal = this.parentList.modals.find(x => x.id == column.ModalId);

                    if (this.parentList.entity == "Announcement") {
                        var announcement = response as Announcement;
                        targetModal?.UpdateAnnouncement(column, announcement);
                    }
                    else {
                        var reservation = response as Slot;
                        targetModal?.UpdateReservation(column, reservation);
                    }
                });
                break;

            case "link":
                newButton = document.createElement("a");
                newButton.href = column.ActionUrl + "?announcement=" + response.Id;
                break;

            case "postback":
                newButton = document.createElement("button");
                newButton.type = "button";
                newButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    __doPostBack(column.Method, response.Id);
                });
                break;
        }
        
        newButton.textContent = column.Label;
        let cssClass = "btn-primary";
        switch(column.Method) {
            case "publish":
                cssClass = "btn-success";
                break;
            case "refuse":
                cssClass = "btn-danger";
                break;
            case "archive":
                cssClass = "btn-warning";
        }
        newButton.classList.add('btn', cssClass);
        
        newCell.appendChild(newButton);
        newCell.classList.add("align-middle");

        row.appendChild(newCell);
    }
 
    BuildAnnouncementPropertyCell(row: HTMLTableRowElement, column: PropertyColumnSettings, announcement: Announcement) : void {
        var newCell = document.createElement("td");
        var textContent: string;

        switch(column.Property.toLowerCase()) {
            case "id":
                newCell = document.createElement("th");
                newCell.scope = "row";
                textContent = announcement.Id.toString();
                break;
                
            case "category":
                textContent = announcement.Category;
                break;

            case "typology":
                textContent = announcement.Typology;
                break;

            case "title":
                textContent = announcement.Title;
                break;
            
            case "firstname":
                textContent = announcement.Announcer.FirstName;
                break;

            case "lastname":
                textContent = announcement.Announcer.LastName;
                break;

            case "begindate":
                textContent = announcement.BeginDate;
                break;

            case "enddate":
                textContent = announcement.EndDate;
                break;
            
            case "publishdate":
                textContent = announcement.PublishDate!;
                break;
            
            case "status":
                textContent = announcement.Status;
                break;
            
            default:
                textContent = "-";
        }

        newCell.textContent = textContent;
        newCell.classList.add("align-middle");

        row.appendChild(newCell);
    }

    BuildAnnouncementActionCell(row: HTMLTableRowElement, column: ActionColumnSettings, announcement: Announcement) {
        var newCell = document.createElement("td");
        
        var newButton;
        switch(column.Action) {
            case "modal":
                newButton = document.createElement("button");
                newButton.type = "button";
                newButton.dataset.bsToggle = "modal";
                newButton.dataset.bsTarget = column.ModalId;
                newButton.addEventListener("click", () => {
                    let targetModal = this.parentList.modals.find(x => x.id == column.ModalId)
                    targetModal?.UpdateAnnouncement(column, announcement);
                });
                break;

            case "link":
                newButton = document.createElement("a");
                newButton.href = column.ActionUrl + "?announcement=" + announcement.Id;
                break;

            case "postback":
                newButton = document.createElement("button");
                newButton.type = "button";
                newButton.addEventListener("click", (event) => {
                    event.preventDefault();
                    __doPostBack(column.Method, announcement.Id);
                });
                break;
        }
        
        newButton.textContent = column.Label;
        let cssClass = "btn-primary";
        switch(column.Method) {
            case "publish":
                cssClass = "btn-success";
                break;
            case "refuse":
                cssClass = "btn-danger";
                break;
            case "archive":
                cssClass = "btn-warning";
        }
        newButton.classList.add('btn', cssClass);
        
        newCell.appendChild(newButton);
        newCell.classList.add("align-middle");

        row.appendChild(newCell);
    }
}