function calculateAndPlotSalary() {
    const rank = document.getElementById('rank').value;
    const userSalary = parseFloat(document.getElementById('annualSalary').value);
    const effortCoverage = parseFloat(document.getElementById('effortCoverage').value);
    const hireDate = new Date(document.getElementById('hireDate').value);

    const rankSalaries = {
        "Instructor": { percentile25: 69044, median: 75675 },
        "Assistant Professor": { percentile25: 103416, median: 123274 },
        "Associate Professor": { percentile25: 136800, median: 156000 },
        "Professor": { percentile25: 192236, median: 223255 }
    };

    const thresholdDate = new Date('2024-07-01');

    if (isNaN(userSalary) || isNaN(effortCoverage) || isNaN(hireDate.getTime())) {
        alert("Please enter valid numbers for salary, effort coverage, and hire date.");
        return;
    }

    const annualSalary = rankSalaries[rank].median;

    const effortLevels = [10, 20, 30, 40, 50, 60, 70, 75, 80, 100];
    if (!effortLevels.includes(effortCoverage)) {
        effortLevels.push(effortCoverage);
        effortLevels.sort((a, b) => a - b); // Ensure the array is sorted
    }
    
    const incentivizedSalaries = effortLevels.map(effort => ({
        x: effort,
        y: calculateSalary(annualSalary, effort)
    }));
    const currentIncentivizedSalary = calculateSalary(annualSalary, effortCoverage);

    const legacySalary = Math.max(rankSalaries[rank].percentile25, userSalary);
    const legacySalaries = effortLevels.map(effort => ({
        x: effort,
        y: legacySalary
    }));

    const ctxIncentivized = document.getElementById('incentivizedChart').getContext('2d');
    const ctxLegacy = document.getElementById('legacyChart').getContext('2d');

    // Check if chart instances exist and destroy them
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
                label: 'Salaries at Different Effort Levels',
                data: incentivizedSalaries,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false,
                tension: 0.1 // Smoothing the line
            },
            {
                label: 'Current Effort Level',
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
                tension: 0.1 // Smoothing the line
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

    if (hireDate < thresholdDate) {
        document.getElementById('incentivizedPlan').style.display = 'flex';
        document.getElementById('legacyPlan').style.display = 'flex';
    } else {
        document.getElementById('incentivizedPlan').style.display = 'none';
        document.getElementById('legacyPlan').style.display = 'none';
        alert('Incentivized plan only for hires after 7/1/2024');
    }

    document.getElementById('results').style.display = 'flex';
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
