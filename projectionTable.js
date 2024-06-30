export default class ProjectionTable {
    constructor() {
        this.tableElement = document.getElementById('projectionTableContent');
    }

    displayTable(projectionData,legacyProjectionData, salaryDifference) {
        let legacyIterator = 0;

        this.tableElement.innerHTML = `
            <tr>
                <th>Year</th>
                <th>Incentivized Plan Base Salary</th>
                <th>Coverage %</th>
                <th>Incentivized Plan Effective Salary</th>
                <th>Legacy Plan Salary</th>
                <th>Salary Difference</th>
            </tr>
        `;
        for (const data of projectionData) {
            const legacyData = legacyProjectionData[legacyIterator];

            this.tableElement.innerHTML += `
                <tr>
                    <td>${data.year}</td>
                    <td>${this.formatCurrency(data.baseSalary)}</td>
                    <td>${data.coverage}</td>
                    <td>${this.formatCurrency(data.salaryThisYear)}</td>
                    <td>${this.formatCurrency(legacyData.salaryThisYear)}</td>
                    <td>${this.formatCurrency(salaryDifference[legacyIterator].difference)}</td>
                </tr>
            `;
            legacyIterator++;
        }
        document.getElementById('projectionTable').style.display = 'block';
    }
    formatCurrency(value) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}