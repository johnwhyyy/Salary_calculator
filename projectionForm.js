export default class ProjectionForm {
    //Input Properties
    effortCoverage

    constructor(effortCoverage) {
        this.effortCoverage = effortCoverage;
        this.currentYear = new Date().getFullYear();
        this.formElement = document.getElementById('projectionFormElements');
        this.initForm();
    }

    initForm() {
        if (!this.formElement) {
            console.error("Form element not found!");
            return;
        }

        // Add headers to the form
        this.formElement.innerHTML = `
            <div class="projection-header">
                <span>Year</span>
                <span>Coverage %</span>
                <span>Assume Getting Promoted This Year</span>
            </div>
        `;

        for (let i = 0; i < 5; i++) {
            const year = this.currentYear + i;
            this.formElement.innerHTML += `
                <div class="projection-row">
                    <label>${year}</label>
                    <input type="number" min="0" max="100" id="coverage${i}" placeholder="Coverage %" value="${this.effortCoverage}" required>
                    <input type="checkbox" id="promotion${i}">
                </div>
            `;
        }
    }

    getFormData() {
        const formData = [];
        for (let i = 0; i < 5; i++) {
            formData.push({
                year: this.currentYear + i,
                coverage: parseFloat(document.getElementById(`coverage${i}`).value),
                promoted: document.getElementById(`promotion${i}`).checked
            });
        }
        return formData;
    }
}
