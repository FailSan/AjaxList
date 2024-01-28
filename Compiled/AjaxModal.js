export class AjaxModal {
    parentList;
    id;
    container;
    label;
    body;
    constructor(modalId, parentList) {
        this.parentList = parentList;
        this.id = modalId;
        this.container = document.querySelector(this.id);
        this.label = this.container.querySelector(".modal-title");
        this.body = this.container.querySelector(".modal-body");
    }
    get buttons() {
        return this.container.querySelectorAll("[data-action]");
    }
    async UpdateAnnouncement(columnSetting, announcement) {
        if (columnSetting.Method == "detail") {
            this.PopulateAnnouncement(announcement);
            if (announcement.Category == "Offro" || announcement.Category == "Offer") {
                /*
                let offerFetch = await fetch("/offer/get/" + announcement.Id, {
                    method: "get",
                })
                .then(x => x.json());
                this.PopulateOffer(offerFetch);
                */
            }
            else {
                /*
                let requestFetch = await fetch("/request/get/" + announcement.Id, {
                    method: "get",
                })
                .then(x => x.json());
                
                this.PopolateRequest(requestFetch);
                */
            }
            this.buttons.forEach(x => {
                let method = x.dataset.method;
                let newButton = x.cloneNode(true);
                newButton.addEventListener("click", () => {
                    __doPostBack(method, announcement.Id);
                });
                x.parentElement?.replaceChild(newButton, x);
            });
        }
        else {
            //Sto aggiornando una confirmModal
            //Modifico la Label e aggiorno il bottone
            this.label.textContent = columnSetting.Method;
            this.buttons.forEach(x => {
                let newButton = x.cloneNode(true);
                newButton.textContent = announcement.Id;
                newButton.addEventListener("click", () => {
                    __doPostBack(columnSetting.Method, announcement.Id);
                });
                x.parentElement?.replaceChild(newButton, x);
            });
        }
    }
    PopulateAnnouncement(announcement) {
        var categoryField = this.body.querySelector("[data-property='Category']");
        if (categoryField)
            categoryField.textContent = announcement.Category;
        var typologyField = this.body.querySelector("[data-property='Typology']");
        if (typologyField)
            typologyField.textContent = announcement.Typology;
        var publishDateField = this.body.querySelector("[data-property='PublishDate']");
        if (publishDateField)
            publishDateField.textContent = announcement.PublishDate ? announcement.PublishDate.toDateString() : "-";
        var beginDateField = this.body.querySelector("[data-property='BeginDate']");
        if (beginDateField)
            beginDateField.textContent = announcement.BeginDate.toDateString();
        var endDateField = this.body.querySelector("[data-property='EndDate']");
        if (endDateField)
            endDateField.textContent = announcement.EndDate.toDateString();
        var publisherField = this.body.querySelector("[data-property='Announcer']");
        if (publisherField) {
            let announcerDetails = `${announcement.Announcer.FirstName} ${announcement.Announcer.LastName} - ${announcement.Announcer.Email} - ${announcement.Announcer.PhoneNumber}`;
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
            let locationDetails = `${announcement.Location.Address}, ${announcement.Location.CivicNumber}, ${announcement.Location.CAP} - ${announcement.Location.Municipality} (${announcement.Location.Province})`;
            locationField.textContent = locationDetails;
        }
    }
    PopulateOffer(offer) {
        var slotFields;
    }
    PopolateRequest(request) {
        var responseFields;
    }
}
