import { AjaxList } from "./AjaxList.js";
import { ActionColumnSettings } from "./AjaxTable.js";
import { Announcement, Offer, Request, Slot } from "./Announcement.js";

export class AjaxModal {
    parentList: AjaxList;
    id: string;
    container: HTMLElement;
    label: HTMLElement;
    body: HTMLElement;

    constructor(modalId: string, parentList: AjaxList) {
        this.parentList = parentList;
        this.id = modalId;
        this.container = document.querySelector(this.id) as HTMLElement;
        this.label = this.container.querySelector(".modal-title") as HTMLElement;
        this.body = this.container.querySelector(".modal-body") as HTMLElement;
    }

    get buttons(): NodeListOf<HTMLButtonElement> {
        return this.container.querySelectorAll("[data-action]") as NodeListOf<HTMLButtonElement>;
    }

    async UpdateAnnouncement(columnSetting: ActionColumnSettings, announcement: Announcement) {
        if (columnSetting.Method == "detail") {

            this.PopulateAnnouncement(announcement);
            
            if (announcement.Category == "Offro" || announcement.Category == "Offer") {
                let offerResult: Offer;
                let serverResponse = await fetch("/api/cerco-offro/offer/get/" + announcement.Id, {
                    method: "get",
                });

                if (!serverResponse.ok) {
                    offerResult = {

                    } as Offer;
                }

                else {
                    offerResult = await serverResponse.json();
                }

                this.PopulateOffer(offerResult);
            }

            else {
                let requestResult: Request;
                let serverResponse = await fetch("/api/cerco-offro/request/get/" + announcement.Id, {
                    method: "get",
                });

                if (!serverResponse.ok) {
                    requestResult = {

                    } as Request
                }

                else {
                    requestResult = await serverResponse.json();
                }
                
                this.PopulateRequest(requestResult);
            }

            this.buttons.forEach(x => {
                let method = x.dataset.method;
                let newButton = x.cloneNode(true);
                newButton.addEventListener("click", () => {
                    __doPostBack(method!, announcement.Id);
                });
                x.parentElement?.replaceChild(newButton, x);
            });
        }

        else {
            //Sto aggiornando una confirmModal
            //Modifico la Label e aggiorno il bottone
            this.label.textContent = columnSetting.Label;
            var methodAlerts = this.body.querySelectorAll("[data-method]");
            methodAlerts.forEach(x => {
                if((x as HTMLElement).dataset.method == columnSetting.Method) 
                    x.classList.remove("d-none");
                else
                    x.classList.add("d-none")
            });

            this.buttons.forEach(x => {
                let newButton = x.cloneNode(true);
                newButton.addEventListener("click", () => {
                    __doPostBack(columnSetting.Method, announcement.Id);
                });
                x.parentElement?.replaceChild(newButton, x);
            })
        }
    }

    async UpdateReservation(columnSetting: ActionColumnSettings, reservation: Slot) {
        if (columnSetting.Method == "detail") {
            let offerResult: Offer;
            let serverResponse = await fetch("/api/cerco-offro/offer/get/" + reservation.OfferId, {
                method: "get",
            });

            if (!serverResponse.ok) {
                offerResult = {

                } as Offer;
            }

            else {
                offerResult = await serverResponse.json();
            }

            this.PopulateReservation(offerResult, reservation);

            this.buttons.forEach(x => {
                let method = x.dataset.method;
                let newButton = x.cloneNode(true);
                newButton.addEventListener("click", () => {
                    __doPostBack(method!, reservation.Id);
                });
                x.parentElement?.replaceChild(newButton, x);
            });
        }

        else {
            //Sto aggiornando una confirmModal
            //Modifico la Label e aggiorno il bottone
            this.label.textContent = columnSetting.Label;
            var methodAlerts = this.body.querySelectorAll("[data-method]");
            methodAlerts.forEach(x => {
                if((x as HTMLElement).dataset.method == columnSetting.Method) 
                    x.classList.remove("d-none");
                else
                    x.classList.add("d-none")
            });

            this.buttons.forEach(x => {
                let newButton = x.cloneNode(true);
                newButton.addEventListener("click", () => {
                    __doPostBack(columnSetting.Method, reservation.Id);
                });
                x.parentElement?.replaceChild(newButton, x);
            })
        }
    }

    PopulateAnnouncement(announcement: Announcement) {
        var interactions = this.body.querySelector("[data-property='Interactions'");
        if (interactions) {
            let currentDiv = interactions.parentElement;
            currentDiv?.classList.add("d-none");
            interactions.innerHTML = "";
        }

        var categoryField = this.body.querySelector("[data-property='Category']");
        if (categoryField)
            categoryField.textContent = announcement.Category;

        var typologyField = this.body.querySelector("[data-property='Typology']");
        if (typologyField)
            typologyField.textContent = announcement.Typology;

        var publishDateField = this.body.querySelector("[data-property='PublishDate']");
        if (publishDateField)
            publishDateField.textContent = announcement.PublishDate ? announcement.PublishDate : "-";
        
        var beginDateField = this.body.querySelector("[data-property='BeginDate']");
        if (beginDateField)
            beginDateField.textContent = announcement.BeginDate;

        var endDateField = this.body.querySelector("[data-property='EndDate']");
        if (endDateField)
            endDateField.textContent = announcement.EndDate;

        var publisherField = this.body.querySelector("[data-property='Announcer']");
        if (publisherField) {
            let announcerDetails = `${announcement.Announcer.FirstName} ${announcement.Announcer.LastName} - ${announcement.Announcer.Email} - ${announcement.Announcer.PhoneNumber}`
            publisherField.textContent = announcerDetails;
        }

        var titleField = this.body.querySelector("[data-property='Title']");
        if (titleField)
            titleField.textContent = announcement.Title;

        var descriptionField = this.body.querySelector("[data-property='Description'");
        if (descriptionField)
            descriptionField.textContent = announcement.Description;

        var locationField = this.body.querySelector("[data-property='Location']");
        if (locationField) {
            let locationDetails = `${announcement.Location.Address}, ${announcement.Location.CivicNumber}, ${announcement.Location.Cap} - ${announcement.Location.Municipality} (${announcement.Location.Province})`;
            locationField.textContent = locationDetails;
        }
    }

    PopulateReservation(offer: Offer, reservation: Slot) {
        var typologyField = this.body.querySelector("[data-property='Typology']");
        if (typologyField)
            typologyField.textContent = reservation.Typology;

            var categoryField = this.body.querySelector("[data-property='Category']");
            if (categoryField)
                categoryField.textContent = offer.Category;
    
            var typologyField = this.body.querySelector("[data-property='Typology']");
            if (typologyField)
                typologyField.textContent = offer.Typology;
    
            var publishDateField = this.body.querySelector("[data-property='PublishDate']");
            if (publishDateField)
                publishDateField.textContent = offer.PublishDate ? offer.PublishDate : "-";
            
            var beginDateField = this.body.querySelector("[data-property='BeginDate']");
            if (beginDateField)
                beginDateField.textContent = offer.BeginDate;
    
            var endDateField = this.body.querySelector("[data-property='EndDate']");
            if (endDateField)
                endDateField.textContent = offer.EndDate;
    
            var publisherField = this.body.querySelector("[data-property='Announcer']");
            if (publisherField) {
                let announcerDetails = `${offer.Announcer.FirstName} ${offer.Announcer.LastName} - ${offer.Announcer.Email} - ${offer.Announcer.PhoneNumber}`
                publisherField.textContent = announcerDetails;
            }
    
            var titleField = this.body.querySelector("[data-property='Title']");
            if (titleField)
                titleField.textContent = offer.Title;
    
            var descriptionField = this.body.querySelector("[data-property='Description'");
            if (descriptionField)
                descriptionField.textContent = offer.Description;
    
            var locationField = this.body.querySelector("[data-property='Location']");
            if (locationField) {
                let locationDetails = `${offer.Location.Address}, ${offer.Location.CivicNumber}, ${offer.Location.Cap} - ${offer.Location.Municipality} (${offer.Location.Province})`;
                locationField.textContent = locationDetails;
            }

        var publisherField = this.body.querySelector("[data-property='ReservedBy']");
        if (publisherField) {
            let announcerDetails = `${reservation.Reservation?.ReservedBy.FirstName} ${reservation.Reservation?.ReservedBy.LastName} - ${reservation.Reservation?.ReservedBy.Email} - ${reservation.Reservation?.ReservedBy.PhoneNumber}`
            publisherField.textContent = announcerDetails;
        }
    }

    PopulateOffer(offer: Offer) {
        let interactionsField = this.body.querySelector("[data-property='Interactions']");

        let reversations = offer.Slots.filter(x => x.Reservation != null);
        if (reversations.length) {
            reversations.forEach(x => {
                let listItem = document.createElement("li");
                listItem.textContent = `${x.Date} - ${x.Start}: ${x.Reservation?.ReservedBy.FirstName} ${x.Reservation?.ReservedBy.LastName} - ${x.Reservation?.ReservedBy.Email} - ${x.Reservation?.ReservedBy.PhoneNumber}`;
                interactionsField?.appendChild(listItem);
            })

            let currentDiv = interactionsField?.parentElement;
            currentDiv?.classList.remove("d-none");

            (<HTMLElement>currentDiv?.firstElementChild).textContent = "Slot";
        }
    }

    PopulateRequest(request: Request) {
        let interactionsField = this.body.querySelector("[data-property='Interactions']");

        let responses = request.Responses;
        if (responses.length) {
            responses.forEach(x => {
                let listItem = document.createElement("li");
                listItem.textContent = `${x.RespondedAt}: ${x.RespondedBy.FirstName} ${x.RespondedBy.LastName}`;
                interactionsField?.appendChild(listItem);
            })
            
            let currentDiv = interactionsField?.parentElement;
            currentDiv?.classList.remove("d-none");

            (<HTMLElement>currentDiv?.firstElementChild).textContent = "Responses";
        }
    }
}