function calculateSalary() {
    const annualSalary = parseFloat(document.getElementById('annualSalary').value);
    const effortCoverage = parseFloat(document.getElementById('effortCoverage').value);

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

    document.getElementById('calculatedSalary').textContent = `$${calculatedSalary.toFixed(2)}`;
}
