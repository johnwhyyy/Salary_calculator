export default class ProjectionChart {
    constructor() {
        this.chartElement = document.getElementById('projectionChartCanvas');
        this.differenceChartElement = document.getElementById('differenceChartCanvas');
        this.chart = null;
        this.differenceChart = null;
    }

    displayChart(projectionData, legacyProjectionData) {
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = this.chartElement.getContext('2d');
        const labels = projectionData.map(data => data.year);
        const data = projectionData.map(data => data.salaryThisYear);
        const legacyData = legacyProjectionData.map(data => data.salaryThisYear);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Projected Incentivized Plan Salary',
                        data: data,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Legacy Plan Salary',
                        data: legacyData,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                        fill: false,
                        tension: 0.1
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
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

        document.getElementById('projectionChart').style.display = 'block';
    }

    displayDifference(salaryDifference) {
        if (this.differenceChart) {
            this.differenceChart.destroy();
        }

        const ctx = this.differenceChartElement.getContext('2d');
        const labels = salaryDifference.map(data => data.year);
        const data = salaryDifference.map(data => data.difference);

        this.differenceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Yearly Salary Difference',
                        data: data,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Difference ($)'
                        }
                    }
                }
            }
        });

        document.getElementById('differenceChart').style.display = 'block';
    }
}
