function calculateTwice() {
    calculateAndPlotSalary();
    calculateAndPlotSalary();
}

function calculateAndPlotSalary() {
    const rank = document.getElementById('rank').value;
    const tenureStatus = document.getElementById('tenureStatus').value;
    const userSalary = parseFloat(document.getElementById('annualSalary').value);
    const effortCoverage = parseFloat(document.getElementById('effortCoverage').value);
    const hireDate = new Date(document.getElementById('hireDate').value);

    const rankSalaries = {
        "Instructor": { percentile25: 69044, median: 75675 },
        "Assistant Professor": { percentile25: 103416, median: 123274 },
        "Associate Professor": { percentile25: 136800, median: 156000 },
        "Professor": { percentile25: 192236, median: 223255 }
    };

    const thresholdDate = new Date('2024-07-01T00:00:00-04:00'); // Set threshold date to 2024-07-01 at midnight ET (Eastern Daylight Time)

    if (isNaN(userSalary) || isNaN(effortCoverage) || isNaN(hireDate.getTime())) {
        alert("Please enter valid numbers for salary, effort coverage, and hire date.");
        return;
    }

    const annualSalary = rankSalaries[rank].median;

    const effortLevels = [10, 20, 30, 40, 50, 60, 70, 75, 80, 100];
    if (!effortLevels.includes(effortCoverage)) {
        effortLevels.push(effortCoverage);
        effortLevels.sort((a, b) => a - b);
    }

    let incentivizedSalaries;
    if (tenureStatus === 'Tenure-eligible') {
        incentivizedSalaries = effortLevels.map(effort => ({
            x: effort,
            y: annualSalary
        }));
    } else {
        incentivizedSalaries = effortLevels.map(effort => ({
            x: effort,
            y: calculateSalary(annualSalary, effort)
        }));
    }
    const currentIncentivizedSalary = tenureStatus === 'Tenure-eligible' ? annualSalary : calculateSalary(annualSalary, effortCoverage);

    const legacySalary = Math.max(rankSalaries[rank].percentile25, userSalary);
    const legacySalaries = effortLevels.map(effort => ({
        x: effort,
        y: legacySalary
    }));

    const ctxIncentivized = document.getElementById('incentivizedChart').getContext('2d');
    const ctxLegacy = document.getElementById('legacyChart').getContext('2d');

    if (window.incentivizedChart instanceof Chart) {
        window.incentivizedChart.destroy();
    }
    if (window.legacyChart instanceof Chart) {
        window.legacyChart.destroy();
    }

    window.incentivizedChart = new Chart(ctxIncentivized, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Salary at This Effort Level',
                data: incentivizedSalaries,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false,
                tension: 0.1
            },
            {
                label: 'Salary at Current Effort Level',
                data: [{ x: effortCoverage, y: currentIncentivizedSalary }],
                pointBackgroundColor: 'rgba(255, 99, 132, 0.2)',
                pointBorderColor: 'rgba(255, 99, 132, 1)',
                pointBorderWidth: 2,
                showLine: false,
                pointRadius: 5
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Incentivized Plan'
                },
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 0,
                            yMax: currentIncentivizedSalary,
                            xMin: effortCoverage,
                            xMax: effortCoverage,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 2,
                            borderDash: [10, 5],
                            label: {
                                content: 'Current Effort Level',
                                enabled: true,
                                position: 'start'
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

    window.legacyChart = new Chart(ctxLegacy, {
        type: 'line',
        data: {
            datasets: [{
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
                    display: true,
                    text: 'Legacy Plan'
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

    const hoverNote = document.getElementById('hoverNote');
    hoverNote.style.display = 'block';

    const incentivizedPlanMessage = document.getElementById('incentivizedPlanMessage');
    if (tenureStatus === 'Tenure-eligible') {
        incentivizedPlanMessage.textContent = "Full Salary Coverage guaranteed in the tenure probationary period";
        incentivizedPlanMessage.style.display = 'block';
    } else {
        incentivizedPlanMessage.style.display = 'none';
    }

    if (hireDate < thresholdDate) {
        document.getElementById('incentivizedPlan').style.display = 'block';
        document.getElementById('legacyPlan').style.display = 'block';
    } else {
        document.getElementById('incentivizedPlan').style.display = 'block';
        document.getElementById('legacyPlan').style.display = "none";
        incentivizedPlanMessage.textContent = "All faculties hired after " + thresholdDate.toLocaleDateString() + " follow the incentivized plan.";
        incentivizedPlanMessage.style.display = 'block';
    }

    document.getElementById('results').style.display = 'block';
}

function calculateSalary(annualSalary, effortCoverage) {
    let calculatedSalary = 0;
    if (effortCoverage < 25) {
        calculatedSalary = annualSalary * 0.75;
    } else if (effortCoverage <= 50) {
        calculatedSalary = annualSalary * 0.75;
    } else if (effortCoverage <= 75) {
        calculatedSalary = annualSalary * 0.75 + (annualSalary * 0.01 * (effortCoverage - 50));
    } else {
        calculatedSalary = annualSalary;
    }
    return calculatedSalary;
}
