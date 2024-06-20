export default class FormHandler {
    constructor(formId) {
        this.form = document.getElementById(formId);
    }

    getFormData() {
        return {
            rank: document.getElementById('rank').value,
            tenureStatus: document.getElementById('tenureStatus').value,
            userSalary: parseFloat(document.getElementById('annualSalary').value),
            effortCoverage: parseFloat(document.getElementById('effortCoverage').value)
        };
    }

    resetForm() {
        this.form.reset();
        this.form.style.display = 'flex';
        this.form.style.flexDirection = 'column';
    }

    hideForm() {
        this.form.style.display = 'none';
    }
}
