export default class EventHandler {
    constructor(formHandler, salaryCalculator) {
        this.formHandler = formHandler;
        this.salaryCalculator = salaryCalculator;
    }

    initEventListeners() {
        document.getElementById('salaryForm').addEventListener('input', () => this.salaryCalculator.resetNextRank());
        document.getElementById('calculateButton').addEventListener('click', () => this.salaryCalculator.calculateTwice());
        document.getElementById('nextRankButton').addEventListener('click', () => this.salaryCalculator.calculateNextRank());
        document.getElementById('resetButton').addEventListener('click', () => this.salaryCalculator.resetAndRecalculate());
        document.getElementById('showProjectionButton').addEventListener('click', () => this.salaryCalculator.showProjection());
    }
}
