export default class CalculatorLogic {
    constructor(rankSalaries) {
        this.rankSalaries = rankSalaries;
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

    getEffortLevels(effortCoverage) {
        const effortLevels = [45, 47.5, 50, 52.5, 55, 57.5, 60, 62.5, 65, 67.5, 70, 72.5, 75, 77.5, 80];
        if (!effortLevels.includes(effortCoverage)) {
            effortLevels.push(effortCoverage);
            effortLevels.sort((a, b) => a - b);
        }
        return effortLevels;
    }

    getIncentivizedSalaries(tenureStatus, annualSalary, effortLevels) {
        if (tenureStatus === 'Tenure-eligible') {
            return effortLevels.map(effort => ({ x: effort, y: annualSalary }));
        } else {
            return effortLevels.map(effort => ({ x: effort, y: this.calculateSalary(annualSalary, effort) }));
        }
    }
}
