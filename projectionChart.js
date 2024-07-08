export default class ProjectionChart {
    //Objects
    chart;
    differenceChart;
    chartElement;
    differenceChartElement;

    constructor() {
        this.chartElement = document.getElementById('projectionChartCanvas');
        this.differenceChartElement = document.getElementById('differenceChartCanvas');
        this.chart = null;
        this.differenceChart = null;
    }

    displayChart(projectionData, legacyProjectionData) {
        this.clearCanvas(this.chartElement);
        if (this.chart) {
            this.chart.destroy();
            this.chart = null; 
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
        this.clearCanvas(this.differenceChartElement);
        if (this.differenceChart) {
            this.differenceChart.destroy();
            this.differenceChart = null; 
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
                        label: 'Annual Salary Difference: Projected Incentived Plan - Legacy Plan',
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
    destroy() {
        if (this.chart) {
            console.log('destroying projection chart'); // Debug line to confirm chart is being destroyed
            this.chart.destroy();
            this.chart = null;
            this.clearCanvas(this.chartElement);
        }
        
        if (this.differenceChart) {
            console.log('destroying difference chart');// Debug line to confirm chart is being destroyed
            this.differenceChart.destroy();
            this.differenceChart = null;
            this.clearCanvas(this.differenceChartElement);
        }
    }

    // Function to log all Chart instances
    logChartInstances() {
        console.log('Logging all Chart instances:');
        for (let chartId in Chart.instances) {
            if (Chart.instances.hasOwnProperty(chartId)) {
                console.log(`Chart ID: ${chartId}`, Chart.instances[chartId]);
            }
        }
    }
    // Function to clear the canvas
    clearCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
