import ProjectionForm from './projectionForm.js';
import ProjectionCalculation from './projectionCalculation.js';
import ProjectionTable from './projectionTable.js';
import ProjectionChart from './projectionChart.js';

export default class ProjectionHandler {
    //Input Properties
    incentivizedBaseSalary;
    legacySalary;
    rank;
    effortCoverage;
    tentureStatus;

    //Calculated Properties

    //Constant Properties
    rankSalaries;

    constructor(rankSalaries, incentivizedBaseSalary,legacySalary, rank, effortCoverage, tenureStatus) {
        //Save user inputs and caluculated fields from salaryCalculator
        this.rankSalaries = rankSalaries;
        this.incentivizedBaseSalary = incentivizedBaseSalary;
        this.legacySalary = legacySalary;
        this.rank = rank;
        this.effortCoverage = effortCoverage;
        this.tenureStatus = tenureStatus;

        //Create instances of the included classes
        this.projectionForm = new ProjectionForm(effortCoverage);
        document.getElementById('projectionForm').style.display = 'block';
        this.projectionCalculation = new ProjectionCalculation(rankSalaries, tenureStatus);
        this.projectionTable = new ProjectionTable();
        this.projectionChart = new ProjectionChart();

        // Add event listener to the button
        document.getElementById('calculateProjectionButton').addEventListener('click', () => {
            this.calculateProjection();
        });
        document.getElementById('resetProjectionButton').addEventListener('click', () => {
            this.reset();
        });
        document.getElementById('backToResultsButton').addEventListener('click', () => {
            this.backToResults();
        });
    }

    calculateProjection() {
        const formData = this.projectionForm.getFormData();
        const projectionData = this.projectionCalculation.calculateSalaries(formData, this.incentivizedBaseSalary, this.rank, this.rankSalaries);
        console.log('projectionData:', projectionData); // Debug line to examine projectionData
        if (projectionData === null) {
            return; // Exit early if there is an error
        }
        const legacyProjectionData = this.projectionCalculation.calculateLegacySalary(formData, this.legacySalary, this.rank, this.rankSalaries);
        const salaryDifference = this.projectionCalculation.calculateDifferece(projectionData, legacyProjectionData);
        this.projectionTable.displayTable(projectionData, legacyProjectionData, salaryDifference);
        this.projectionChart.displayChart(projectionData, legacyProjectionData);
        this.projectionChart.displayDifference(salaryDifference);
        document.getElementById('projectionForm').style.display = 'none';
        document.getElementById('resetProjectionButton').style.display = 'block';
        document.getElementById('backToResultsButton').style.display = 'block';
    }

    reset() {
        this.projectionForm.initForm();
        document.getElementById('projectionForm').style.display = 'block';
        document.getElementById('projectionTable').style.display = 'none';
        document.getElementById('projectionChart').style.display = 'none';
        document.getElementById('differenceChart').style.display = 'none';
        document.getElementById('resetProjectionButton').style.display = 'none';

        // Destroy existing charts and tables
        if (this.projectionChart.chart) {
            document.getElementById('projectionChart').destroy();
            this.projectionChart.chart = null; // Reset the chart reference
        }
        if (this.projectionChart.differenceChart) {
            this.projectionChart.differenceChart.destroy();
            this.projectionChart.differenceChart = null; // Reset the chart reference
        }
        if (this.projectionTable.table) {
            this.projectionTable.table.destroy();
        }
    }

    backToResults() {
        this.reset();
        document.getElementById('results').style.display = 'block';
        document.getElementById('projectionPanel').style.display = 'none';
    }
}

/*Projection Module Test Code*/

/*
// Instantiate the ProjectionHandler and assign it to the window object
const rankSalaries = {
    "Assistant Professor": { percentile25: 103416, median: 123274, nextRankRaise: 9991 },
    "Associate Professor": { percentile25: 136800, median: 156000, nextRankRaise: 19982 },
    "Professor": { percentile25: 192236, median: 223255, nextRankRaise: 0 }
};

// Ensure the handler is globally accessible
window.addEventListener('DOMContentLoaded', () => {
    window.projectionHandler = new ProjectionHandler(rankSalaries, 136000, 130000, "Associate Professor", 70);;
});
*/
