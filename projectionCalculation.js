export default class ProjectionCalculation {
    // Input Properties
    formData
    incentivizedBaseSalary
    rank
    rankSalaries
    tenureStatusYear0

    constructor(rankSalaries, tenureStatusYear0) {
        this.rankSalaries = rankSalaries;
        this.tenureStatusYear0 = tenureStatusYear0;
    }

    calculateSalaries(formData, incentivizedBaseSalary, rank, rankSalaries) {
        this.formData = formData;
        this.incentivizedBaseSalary = incentivizedBaseSalary;
        this.rank = rank;
        this.rankSalaries = rankSalaries;
        
        const projectionData = [];
        let currentRank = rank;
        let projectedBaseSalary = incentivizedBaseSalary
        let salaryThisYear;

        for (let i = 0; i < formData.length; i++) {
            const data = formData[i];

            if (data.promoted && currentRank === 'Professor') {
                alert('Cannot promote a Full Professor.');
                return null; // Return null to indicate an error
            }
            
            if (data.promoted && currentRank !== 'Professor') {
                currentRank = this.getNextRank(currentRank);
                if (projectedBaseSalary < this.rankSalaries[currentRank].median) {
                    projectedBaseSalary = this.rankSalaries[currentRank].median; 
                }
                else {
                    projectedBaseSalary = this.calculateYearlyIncrease(projectedBaseSalary, data.year);
                }
                salaryThisYear = this.calculateThisYearSalary(projectedBaseSalary, data.coverage);
            } 
            else {
                projectedBaseSalary = this.calculateYearlyIncrease(projectedBaseSalary, data.year);
                salaryThisYear = this.calculateThisYearSalary(projectedBaseSalary, data.coverage);
            }

            projectionData.push({
                year: data.year,
                coverage: data.coverage,
                promoted: data.promoted,
                rank: currentRank,
                baseSalary: projectedBaseSalary,
                salaryThisYear: salaryThisYear
            });
        }

        return projectionData;
    }

    calculateYearlyIncrease(salary, year) {
        let increaseRate;

        if (year === 2024) {
            increaseRate = 0;
        } 
        else if (year == 2025) {
            increaseRate = 0.03;
        } 
        else if (year == 2026) {
            increaseRate = 0.035;
        } 
        else if (year == 2027) {
            increaseRate = 0.0425;
        } 
        else {
            increaseRate = 0.05;
        }

        const increasedSalary = salary * (1 + increaseRate);
        return increasedSalary;
    }

    calculateThisYearSalary(annualSalary, effortCoverage) {
        // Tenure-Eligible faculty receive 100% of their salary regardless of effort coverage
        if (this.tenureStatusYear0 === "Tenure-eligible") {
            this.tenureStatusYear0 = "Tenured";
            return annualSalary;
        }

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

    getNextRank(currentRank) {
        const ranks = ["Instructor", "Assistant Professor", "Associate Professor", "Professor"];
        const currentIndex = ranks.indexOf(currentRank);
        if (currentIndex < ranks.length - 1) {
            return ranks[currentIndex + 1];
        } 
        else {
            alert('Cannot promote a Full Professor, please check your promotion assumptions.');
            return;
        }
    }

    calculateLegacySalary(formData,year0LegacySalary,rank,rankSalaries) {
        const legacyProjectionData = [];
        let currentRank = rank;
        let salaryThisYear  = year0LegacySalary;

        for (let i = 0; i < formData.length; i++) {
            const data = formData[i];
            if (data.promoted && currentRank !== 'Professor') {
                rank = this.getNextRank(rank);
                salaryThisYear = rankSalaries[rank].percentile25; //new change, use new rank 25 percentile when promoted
            }
            else {
                salaryThisYear = this.calculateYearlyIncrease(salaryThisYear, data.year);
            }

            legacyProjectionData.push({
                year: data.year,
                coverage: data.coverage,
                promoted: data.promoted,
                rank: currentRank,
                baseSalary: salaryThisYear,
                salaryThisYear: salaryThisYear
            });
        }

        return legacyProjectionData;
    }

    calculateDifferece(projectionData,legacyProjectionData) {
        const differenceData = [];
        for (let i = 0; i < projectionData.length; i++) {
            const data = projectionData[i];
            const legacyData = legacyProjectionData[i];
            const difference = data.salaryThisYear - legacyData.salaryThisYear;

            differenceData.push({
                year: data.year,
                coverage: data.coverage,
                promoted: data.promoted,
                rank: data.rank,
                baseSalary: data.baseSalary,
                salaryThisYear: data.salaryThisYear,
                legacySalary: legacyData.salaryThisYear,
                difference: difference
            });
        }

        return differenceData;
    }
}
