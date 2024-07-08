import DataTable from './dataTable.js';
import ChartHandler from './chartHandler.js';
import FormHandler from './formHandler.js';
import SalaryCalculatorLogic from './calculatorLogic.js';
import EventHandler from './eventHandler.js';
import ProjectionHandler from './projectionHandler.js';

class SalaryCalculator {
    //User Input Properties
    rank
    tenureStatus
    userSalary
    effortCoverage

    //Calculated Properties
    incentivizedBaseSalary
    legacySalary
    currentIncentivizedSalary

    //Constant Properties
    rankSalaries

    constructor() {
        // Display the message when the program starts
        this.displayWelcomeMessage();

        this.rankSalaries = {
            "Assistant Professor": { percentile25: 103416, median: 123274, nextRankRaise: 9991 },
            "Associate Professor": { percentile25: 136800, median: 156000, nextRankRaise: 19982 },
            "Professor": { percentile25: 192236, median: 223255, nextRankRaise: 0 }
        };

        this.dataTable = new DataTable('dataTable');
        this.nextDataTable = new DataTable('nextDataTable');
        this.chartHandler = new ChartHandler();
        this.formHandler = new FormHandler('salaryForm');
        this.salaryCalculatorLogic = new SalaryCalculatorLogic(this.rankSalaries);
        this.eventHandler = new EventHandler(this.formHandler, this);

        this.init();
    }


    displayWelcomeMessage() {
        const message = `PLEASE READ\n\nThe Salary Calculator and Projection Tool is designed to help faculty members at Georgetown University Medical Center (GUMC) understand and project their estimated salaries under both the incentivized and legacy tracks of the current Faculty Compensation Plan. The tool allows users to calculate an approximate representation of their current salary based on rank, tenure status, and effort coverage, and estimated merit increases. It also provides a projection of earnings over the next 10 years. This is for illustrative purposes only, aimed at helping faculty make informed decisions about their career and to assist with financial planning. This calculator is not intended to establish, or serve as a guarantee of, a particular salary (or merit increase) for any year covered by the Plan. The actual salary under each track for an individual faculty member may be different, based on a variety of factors, including individual performance evaluations and actual effort coverage.`;

        window.alert(message);
    }

    init() {
        // Bind methods to the instance
        this.calculateTwice = this.calculateTwice.bind(this);
        this.calculateNextRank = this.calculateNextRank.bind(this);
        this.resetAndRecalculate = this.resetAndRecalculate.bind(this);
        this.showProjection = this.showProjection.bind(this);

        document.addEventListener('DOMContentLoaded', () => {
            this.eventHandler.initEventListeners();
        });
    }

    calculateTwice() {
        this.calculateAndPlotSalary();
        this.calculateAndPlotSalary();
        const form = document.getElementById('salaryForm');
        const inputs = form.querySelectorAll('input, select');
        let allFilled = true;
        inputs.forEach(input => {
            if (!input.value) {
                allFilled = false;
            }
        });
        if (allFilled) {
            this.formHandler.hideForm();
            document.getElementById('privacyNote').style.display = 'none';
        }
    }

    resetNextRank() {
        document.getElementById('nextRankResults').style.display = 'none';
        document.getElementById('nextRankButton').style.display = 'block';
        document.getElementById('resetButton').style.display = 'none';
        this.updateCurrentRankHeading();
    }

    calculateAndPlotSalary() {
        const { rank, tenureStatus, userSalary, effortCoverage } = this.formHandler.getFormData();
        this.rank = rank;
        this.tenureStatus = tenureStatus;
        this.userSalary = userSalary;
        this.effortCoverage = effortCoverage;
        
        this.incentivizedBaseSalary = this.rankSalaries[rank].median;
        if (userSalary > this.incentivizedBaseSalary) {
            this.incentivizedBaseSalary = userSalary;
        }

        if (isNaN(userSalary) || isNaN(effortCoverage)) {
            alert("Please enter valid numbers for salary and effort coverage.");
            return;
        }

        const effortLevels = this.salaryCalculatorLogic.getEffortLevels(effortCoverage);
        const incentivizedSalaries = this.salaryCalculatorLogic.getIncentivizedSalaries(tenureStatus, this.incentivizedBaseSalary, effortLevels);
        const currentIncentivizedSalary = tenureStatus === 'Tenure-eligible' ? this.incentivizedBaseSalary : this.salaryCalculatorLogic.calculateSalary(this.incentivizedBaseSalary, effortCoverage);
        this.currentIncentivizedSalary = currentIncentivizedSalary;
        const legacySalary = Math.max(this.rankSalaries[rank].percentile25, userSalary);
        this.legacySalary = legacySalary;
        const legacySalaries = effortLevels.map(effort => ({ x: effort, y: legacySalary }));


        this.chartHandler.plotChart('incentivizedChart', incentivizedSalaries, currentIncentivizedSalary, legacySalaries, effortCoverage);
        this.showResults(rank, tenureStatus, legacySalary, this.incentivizedBaseSalary, currentIncentivizedSalary);
    }

    displayHoverNote() {
        document.getElementById('hoverNote').style.display = 'block';
    }

    displayIncentivizedPlanMessage(tenureStatus) {
        const incentivizedPlanMessage = document.getElementById('incentivizedPlanMessage');
        if (tenureStatus === 'Tenure-eligible') {
            incentivizedPlanMessage.textContent = "Full Salary Coverage guaranteed in the tenure probationary period";
            incentivizedPlanMessage.style.display = 'block';
        } else {
            incentivizedPlanMessage.style.display = 'none';
        }
    }

    showResults(rank, tenureStatus, legacySalary, incentivizedBaseSalary, currentIncentivizedSalary) {
        this.displayHoverNote();
        this.displayIncentivizedPlanMessage(tenureStatus);
        document.getElementById('results').style.display = 'block';
        const nextRankButton = document.getElementById('nextRankButton');
        nextRankButton.style.display = this.getNextRank(rank) ? 'block' : 'none';
        document.getElementById('resetButton').style.display = 'block';
        document.getElementById('showProjectionButton').style.display = 'block';
        this.updateCurrentRankHeading();
        if (tenureStatus === 'Tenure-eligible') {
            document.getElementById('nextRankButton').style.display = 'none';
            document.getElementById('dataTable').style.display = 'none';
        }
        else{
            const breakEvenEffort = this.dataTable.calculateBreakEvenEffort(legacySalary, incentivizedBaseSalary);
            const minimumGuaranteedSalary = this.dataTable.calculateMinimumGuaranteedSalary(incentivizedBaseSalary);

            const headers = ['Metric', 'Value'];
            const data = [
                ['Break-even Effort Coverage (%)', breakEvenEffort.toFixed(2)],
                ['Minimum Guaranteed Salary ($)', minimumGuaranteedSalary.toFixed(2)],
                ['Salary Under Current Effort Coverage Level ($)', currentIncentivizedSalary.toFixed(2)]
            ];
            this.dataTable.createTable(headers, data);
            document.getElementById('dataTable').style.display = 'block';
        }
    }

    calculateNextRank() {
        const rank = document.getElementById('rank').value;
        const nextRank = this.getNextRank(rank);

        if (nextRank) {
            //document.getElementById('rank').value = nextRank;
            this.calculateAndPlotNextRankSalary(nextRank);
            this.calculateAndPlotNextRankSalary(nextRank);
            document.getElementById('nextRankButton').style.display = 'none';
            document.getElementById('resetButton').style.display = 'block';
        } else {
            document.getElementById('noNextRankMessage').style.display = 'block';
            document.getElementById('nextRankResults').style.display = 'none';
        }
        this.updateNextRankHeading(nextRank);
    }

    calculateAndPlotNextRankSalary(nextRank) {
        const { rank, tenureStatus, userSalary, effortCoverage } = this.formHandler.getFormData();
        
        let nextBaseSalary = this.rankSalaries[nextRank].median;
        if (userSalary + this.rankSalaries[rank].nextRankRaise > this.rankSalaries[nextRank].median) {
            nextBaseSalary = userSalary + this.rankSalaries[rank].nextRankRaise;
        }

        const effortLevels = this.salaryCalculatorLogic.getEffortLevels(effortCoverage);
        const incentivizedSalaries = this.salaryCalculatorLogic.getIncentivizedSalaries(tenureStatus, nextBaseSalary, effortLevels);
        const currentIncentivizedSalary = tenureStatus === 'Tenure-eligible' ? nextBaseSalary : this.salaryCalculatorLogic.calculateSalary(nextBaseSalary, effortCoverage);

        const legacySalary = Math.max(this.rankSalaries[nextRank].percentile25, userSalary + this.rankSalaries[rank].nextRankRaise);
        const legacySalaries = effortLevels.map(effort => ({ x: effort, y: legacySalary }));

        this.chartHandler.plotChart('nextRankChart', incentivizedSalaries, currentIncentivizedSalary, legacySalaries, effortCoverage);

        document.getElementById('nextRankResults').style.display = 'block';

        const breakEvenEffort = this.dataTable.calculateBreakEvenEffort(legacySalary, nextBaseSalary);
        const minimumGuaranteedSalary = this.dataTable.calculateMinimumGuaranteedSalary(nextBaseSalary);

        const headers = ['Metric', 'Value'];
        const data = [
            ['Break-even Effort Coverage (%)', breakEvenEffort.toFixed(2)],
            ['Minimum Guaranteed Salary ($)', minimumGuaranteedSalary.toFixed(2)],
            ['Salary Under Current Effort Coverage Level ($)', currentIncentivizedSalary.toFixed(2)]
        ];
        this.nextDataTable.createTable(headers, data);
    }

    getNextRank(rank) {
        const ranks = ["Assistant Professor", "Associate Professor", "Professor"];
        const currentIndex = ranks.indexOf(rank);
        return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
    }

    updateCurrentRankHeading() {
        const rank = document.getElementById('rank').value;
        const currentRankHeading = document.getElementById('currentRankHeading');
        currentRankHeading.textContent = `Salary Under Incentivized Plan VS. Legacy Plan \n(At Current Rank: ${rank})`;
    }

    updateNextRankHeading(nextRank) {
        const nextRankHeading = document.getElementById('nextRankHeading');
        if (nextRank) {
            nextRankHeading.textContent = `Salary Under Incentivized Plan VS. Legacy Plan \n(At Next Rank: ${nextRank})`;
        }
    }

    resetAndRecalculate() {
        this.resetNextRank();
        this.formHandler.resetForm();
        document.getElementById('privacyNote').style.display = 'block';
        document.getElementById('results').style.display = 'none';
        document.getElementById('hoverNote').style.display = 'none';
        document.getElementById('incentivizedPlanMessage').style.display = 'none';
        document.getElementById('nextRankResults').style.display = 'none';
        document.getElementById('nextRankButton').style.display = 'none';
        document.getElementById('resetButton').style.display = 'none';
        document.getElementById('projectionForm').style.display = 'none';
        document.getElementById('projectionTable').style.display = 'none';
        document.getElementById('projectionChart').style.display = 'none';
    }

    showProjection() {
        const projectionHandler = new ProjectionHandler(this.rankSalaries, this.incentivizedBaseSalary, this.legacySalary, this.rank, this.effortCoverage, this.tenureStatus);
        document.getElementById('projectionPanel').style.display = 'block';
        document.getElementById('results').style.display = 'none';
        document.getElementById('hoverNote').style.display = 'none';  
    }
}

// Initialize the SalaryCalculator
const mySalaryCalculator = new SalaryCalculator();

