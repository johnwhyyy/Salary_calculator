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

    // Debugging: log data to console
    console.log('Annual Salary:', annualSalary);
    console.log('Effort Coverage:', effortCoverage);
    console.log('Salaries:', salaries);
    console.log('Current Salary:', currentSalary);

    const ctx = document.getElementById('salaryChart').getContext('2d');
    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Salaries at Different Effort Levels',
                data: effortLevels.map((effort, index) => ({ x: effort, y: salaries[index] })),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Current Effort Level',
                data: [{ x: effortCoverage, y: currentSalary }],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
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
