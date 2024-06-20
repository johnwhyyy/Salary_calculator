export default class DataTable {
    constructor(tableId) {
        this.tableElement = document.getElementById(tableId);
    }

    createTable(headers, data) {
        this.clearTable();
        this.createHeader(headers);
        this.createRows(data);
    }

    createHeader(headers) {
        const thead = this.tableElement.createTHead();
        const row = thead.insertRow();
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            row.appendChild(th);
        });
    }

    createRows(data) {
        const tbody = this.tableElement.createTBody();
        data.forEach(rowData => {
            const row = tbody.insertRow();
            rowData.forEach(cellData => {
                const cell = row.insertCell();
                cell.textContent = cellData;
            });
        });
    }

    clearTable() {
        this.tableElement.innerHTML = '';
    }

    calculateBreakEvenEffort(legacySalary, incentivizedSalary, minEffort = 0, maxEffort = 100, precision = 0.01) {
        while ((maxEffort - minEffort) > precision) {
            let midEffort = (minEffort + maxEffort) / 2;
            let currentIncentivizedSalary = this.calculateSalary(incentivizedSalary, midEffort);
            if (currentIncentivizedSalary > legacySalary) {
                maxEffort = midEffort;
            } else {
                minEffort = midEffort;
            }
        }
        return (minEffort + maxEffort) / 2;
    }

    calculateMinimumGuaranteedSalary(annualSalary) {
        return annualSalary * 0.75;
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
}