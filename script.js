class SalaryCalculator {
    constructor() {
        this.rankSalaries = {
            "Instructor": { percentile25: 69044, median: 75675 },
            "Assistant Professor": { percentile25: 103416, median: 123274 },
            "Associate Professor": { percentile25: 136800, median: 156000 },
            "Professor": { percentile25: 192236, median: 223255 }
        };
        this.thresholdDate = new Date('2024-07-01T00:00:00-04:00');
        this.initEventListeners();
    }

    initEventListeners() {
        document.getElementById('salaryForm').addEventListener('input', () => this.resetNextRank());
        document.querySelector('button[onclick="calculateTwice()"]').addEventListener('click', () => this.calculateTwice());
        document.getElementById('nextRankButton').addEventListener('click', () => this.calculateNextRank());
        document.getElementById('resetButton').addEventListener('click', () => this.resetAndRecalculate());
    }

    getFormData() {
        return {
            rank: document.getElementById('rank').value,
            tenureStatus: document.getElementById('tenureStatus').value,
            userSalary: parseFloat(document.getElementById('annualSalary').value),
            effortCoverage: parseFloat(document.getElementById('effortCoverage').value),
            hireDate: new Date(document.getElementById('hireDate').value)
        };
    }

    calculateSalary(annualSalary, effortCoverage) {
        if (effortCoverage < 25) {
            return annualSalary * 0.75;
        } else if (effortCoverage <= 50) {
            return annualSalary * 0.75;
        } else if (effortCoverage <= 75) {
            return annualSalary * 0.75 + (annualSalary * 0.01 * (effortCoverage - 50));
        } else {
            return annualSalary;
        }
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
            document.getElementById('salaryForm').style.display = 'none';
        }
    }

    resetNextRank() {
        document.getElementById('nextRankResults').style.display = 'none';
        document.getElementById('nextRankButton').style.display = 'block';
        document.getElementById('resetButton').style.display = 'none';
        this.updateCurrentRankHeading();
    }

    calculateAndPlotSalary() {
        const { rank, tenureStatus, userSalary, effortCoverage, hireDate } = this.getFormData();
        const annualSalary = this.rankSalaries[rank].median;

        if (isNaN(userSalary) || isNaN(effortCoverage) || isNaN(hireDate.getTime())) {
            alert("Please enter valid numbers for salary, effort coverage, and hire date.");
            return;
        }

        const effortLevels = this.getEffortLevels(effortCoverage);

        const incentivizedSalaries = this.getIncentivizedSalaries(tenureStatus, annualSalary, effortLevels);
        const currentIncentivizedSalary = tenureStatus === 'Tenure-eligible' ? annualSalary : this.calculateSalary(annualSalary, effortCoverage);

        const legacySalary = Math.max(this.rankSalaries[rank].percentile25, userSalary);
        const legacySalaries = effortLevels.map(effort => ({ x: effort, y: legacySalary }));

        this.plotChart('incentivizedChart', incentivizedSalaries, currentIncentivizedSalary, legacySalaries, effortCoverage);

        this.displayHoverNote();
        this.displayIncentivizedPlanMessage(tenureStatus, hireDate);
        this.showResults(rank);
    }

    getEffortLevels(effortCoverage) {
        const effortLevels = [10, 20, 30, 40, 50, 60, 70, 75, 80, 100];
        if (!effortLevels.includes(effortCoverage)) {
            effortLevels.push(effortCoverage);
            effortLevels.sort((a, b) => a - b);
        }
        return effortLevels;
    }

    getIncentivizedSalaries(tenureStatus, annualSalary, effortLevels) {
        if (tenureStatus === 'Tenure-eligible') {
            return effortLevels.map(effort => ({ x: effort, y: annualSalary }));
        } 
        else {
            return effortLevels.map(effort => ({ x: effort, y: this.calculateSalary(annualSalary, effort) }));
        }
    }

    plotChart(chartId, incentivizedSalaries, currentIncentivizedSalary, legacySalaries, effortCoverage) {
        const ctx = document.getElementById(chartId).getContext('2d');
        if (window[chartId] instanceof Chart) {
            window[chartId].destroy();
        }

        window[chartId] = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Salary At This Effort Coverage Level (Incentivized Plan)',
                    data: incentivizedSalaries,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'Salary Under Current Effort Coverage Level (Incentivized Plan)',
                    data: [{ x: effortCoverage, y: currentIncentivizedSalary }],
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: 'rgba(255, 0, 0, 1)',
                    pointBorderWidth: 2,
                    showLine: false,
                    pointRadius: 5
                },
                {
                    label: 'Legacy Plan Salary',
                    data: legacySalaries,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    fill: false,
                    tension: 0.1
                }]
            },
            options: {
                plugins: {
                    title: {
                        display: false,
                        text: 'Incentivized vs Legacy Plan'
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: 0,
                                yMax: currentIncentivizedSalary,
                                xMin: effortCoverage,
                                xMax: effortCoverage,
                                borderColor: 'rgba(255, 99, 132, 0.8)',
                                borderWidth: 2,
                                borderDash: [10, 5],
                                label: {
                                    content: 'Current Effort Level',
                                    enabled: true,
                                    position: 'start',
                                    xAdjust: -10,
                                    yAdjust: 0,
                                    backgroundColor: 'rgba(85,85,85, 0.8)',
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: {
                            display: true,
                            text: 'Effort Coverage (%)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Salary ($)'
                        }
                    }
                }
            }
        });
    }

    displayHoverNote() {
        document.getElementById('hoverNote').style.display = 'block';
    }

    displayIncentivizedPlanMessage(tenureStatus, hireDate) {
        const incentivizedPlanMessage = document.getElementById('incentivizedPlanMessage');
        if (tenureStatus === 'Tenure-eligible') {
            incentivizedPlanMessage.textContent = "Full Salary Coverage guaranteed in the tenure probationary period";
            incentivizedPlanMessage.style.display = 'block';
        } else {
            incentivizedPlanMessage.style.display = 'none';
        }

        if (hireDate < this.thresholdDate) {
            document.getElementById('incentivizedPlan').style.display = 'block';
        } else {
            document.getElementById('incentivizedPlan').style.display = 'block';
            incentivizedPlanMessage.textContent = "All faculties hired after " + this.thresholdDate.toLocaleDateString() + " follow the incentivized plan.";
            incentivizedPlanMessage.style.display = 'block';
        }
    }

    showResults(rank) {
        document.getElementById('results').style.display = 'block';
        const nextRankButton = document.getElementById('nextRankButton');
        nextRankButton.style.display = this.getNextRank(rank) ? 'block' : 'none';
        document.getElementById('resetButton').style.display = 'block';
        this.updateCurrentRankHeading();
    }

    calculateNextRank() {
        const rank = document.getElementById('rank').value;
        const nextRank = this.getNextRank(rank);

        if (nextRank) {
            document.getElementById('rank').value = nextRank;
            this.calculateAndPlotNextRankSalary(nextRank);
            this.calculateAndPlotNextRankSalary(nextRank);
            document.getElementById('nextRankButton').style.display = 'none';
            document.getElementById('resetButton').style.display = 'block';
        } 
        else {
            document.getElementById('noNextRankMessage').style.display = 'block';
            document.getElementById('nextRankResults').style.display = 'none';
        }
        this.updateNextRankHeading(nextRank);
    }

    calculateAndPlotNextRankSalary(nextRank) {
        const { tenureStatus, userSalary, effortCoverage } = this.getFormData();
        const annualSalary = this.rankSalaries[nextRank].median;

        const effortLevels = this.getEffortLevels(effortCoverage);

        const incentivizedSalaries = this.getIncentivizedSalaries(tenureStatus, annualSalary, effortLevels);
        const currentIncentivizedSalary = tenureStatus === 'Tenure-eligible' ? annualSalary : this.calculateSalary(annualSalary, effortCoverage);

        const legacySalary = Math.max(this.rankSalaries[nextRank].percentile25, userSalary);
        const legacySalaries = effortLevels.map(effort => ({ x: effort, y: legacySalary }));

        this.plotChart('nextRankChart', incentivizedSalaries, currentIncentivizedSalary, legacySalaries, effortCoverage);

        document.getElementById('nextRankResults').style.display = 'block';
    }

    getNextRank(rank) {
        const ranks = ["Instructor", "Assistant Professor", "Associate Professor", "Professor"];
        const currentIndex = ranks.indexOf(rank);
        return currentIndex < ranks.length - 1 ? ranks[currentIndex + 1] : null;
    }

    updateCurrentRankHeading() {
        const rank = document.getElementById('rank').value;
        const currentRankHeading = document.getElementById('currentRankHeading');
        currentRankHeading.textContent = `Salary Under Incentivized Plan VS. Legacy Plan (At Current Rank: ${rank})`;
    }

    updateNextRankHeading(nextRank) {
        const nextRankHeading = document.getElementById('nextRankHeading');
        if (nextRank) {
            nextRankHeading.textContent = `Salary Under Incentivized Plan VS. Legacy Plan (At Next Rank: ${nextRank})`;
        }
    }

    resetAndRecalculate() {
        document.getElementById('salaryForm').reset();
        document.getElementById('salaryForm').style.display = 'flex';
        document.getElementById('salaryForm').style.flexDirection = 'column';
        document.getElementById('results').style.display = 'none';
        document.getElementById('hoverNote').style.display = 'none';
        document.getElementById('incentivizedPlanMessage').style.display = 'none';
        document.getElementById('nextRankResults').style.display = 'none';
        document.getElementById('nextRankButton').style.display = 'none';
        document.getElementById('resetButton').style.display = 'none';
    }
}

// Initialize the SalaryCalculator
const salaryCalculator = new SalaryCalculator();
