export default class ChartHandler {
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
                                yMin: legacySalaries[0].y,
                                yMax: currentIncentivizedSalary,
                                xMin: effortCoverage,
                                xMax: effortCoverage,
                                borderColor: 'rgba(255, 99, 132, 0.8)',
                                borderWidth: 2,
                                borderDash: [10, 5],
                                label: {
                                    content: 'Current Effort Level',
                                    enabled: true,
                                    position: 'end',
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
    clearChart(chartId) {
        window[chartId].destroy();
    }
}
