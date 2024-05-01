// function exportPDF(){
//     const invoice = this.document.getElementById("main");
//             console.log(invoice);
//             console.log(window);
//             var opt = {
//                 margin: 1,
//                 filename: 'myfile.pdf',
//                 image: { type: 'jpeg', quality: 0.98 },
//                 html2canvas: { scale: 5 },
//                 jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
//             };
//             html2pdf().from(invoice).set(opt).save();
// }

function exportCSV() {
    const csvData = String(document.getElementById("csv").innerHTML);

    const fileName =document.getElementById("td-title").innerHTML+ "data.csv";
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;

    link.download = fileName;

    link.click();

    URL.revokeObjectURL(url);
}