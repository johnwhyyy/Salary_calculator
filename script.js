function calculateAndPlotSalary() {
    const annualSalary = parseFloat(document.getElementById('annualSalary').value);
    const effortCoverage = parseFloat(document.getElementById('effortCoverage').value);

    if (isNaN(annualSalary) || isNaN(effortCoverage)) {
        alert("Please enter valid numbers for salary and effort coverage.");
        return;
    }

    const effortLevels = [10, 25, 50, 60, 75, 80, 100];
    const salaries = effortLevels.map(effort => calculateSalary(annualSalary, effort));

    const currentSalary = calculateSalary(annualSalary, effortCoverage);

    console.log('Annual Salary:', annualSalary);
    console.log('Effort Coverage:', effortCoverage);
    console.log('Effort Levels:', effortLevels);
    console.log('Salaries:', salaries);
    console.log('Current Salary:', currentSalary);

    const ctx = document.getElementById('salaryChart').getContext('2d');

    window.salaryChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: effortLevels,
            datasets: [{
                label: 'Salaries at Different Effort Levels',
                data: salaries,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                fill: false,
                tension: 0.1 // Smoothing the line
            },
            {
                label: 'Current Effort Level',
                data: effortLevels.map(effort => (effort === effortCoverage ? currentSalary : null)),
                pointBackgroundColor: 'rgba(255, 99, 132, 0.2)',
                pointBorderColor: 'rgba(255, 99, 132, 1)',
                pointBorderWidth: 2,
                showLine: false,
                pointRadius: 5
            }]
        },
        options: {
            plugins: {
                annotation: {
                    annotations: {
                        line1: {
                            type: 'line',
                            yMin: 0,
                            yMax: currentSalary,
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
