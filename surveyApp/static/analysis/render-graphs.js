
document.addEventListener('DOMContentLoaded', function() {
    renderImportanceGraph();
});

function renderImportanceGraph(){

    var jsonData=JSON.parse(String(document.getElementById('jsonDiv').innerHTML));

    var questionNumberLabels=[];
    for(let i=0;i<Object.keys(jsonData).length;i++){
        questionNumberLabels.push('Q'+(i+1));
    }

    var impactData=[];
    for(let i=0;i<Object.keys(jsonData).length;i++){
        impactData.push(jsonData[Object.keys(jsonData)[i]].coefficient_of_impact);
    }
    const maxImpact = Math.max(...impactData.map(Math.abs));

    impactData = impactData.map(value => (value + maxImpact) / (2 * maxImpact));

    var questionData=[];
    for(let i=0;i<Object.keys(jsonData).length;i++){
        questionData.push(jsonData[Object.keys(jsonData)[i]].question_content);
    }


    console.log(questionData);

    var ctx = document.getElementById('importance-graph').getContext('2d');

    var chartData = {
        labels: questionNumberLabels,
        datasets: [{
            label: 'Importance of each question',
            backgroundColor: 'rgba(74, 158, 255,0.5)',
            borderColor: 'rgb(74, 158, 255)',
            data: impactData,
            borderWidth: 2
        }]
    };

    new Chart(ctx, {
        type: 'bar', // Specify the type of chart (e.g., bar, line, pie, etc.)
        data: chartData,
        options: {
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            // Get the index of the hovered item
                            const index = context.dataIndex;
                            // Get the label from the labels array based on the index
                            const label = context.chart.data.labels[index];
                            // switch (label) {
                            //     case 'q1':
                            //         return 'Custom Tooltip Text for Label 1';
                            //     case 'Label 2':
                            //         return 'Custom Tooltip Text for Label 2';
                            //     case 'Label 3':
                            //         return 'Custom Tooltip Text for Label 3';
                            //     case 'Label 4':
                            //         return 'Custom Tooltip Text for Label 4';
                            //     case 'Label 5':
                            //         return 'Custom Tooltip Text for Label 5';
                            //     default:
                            //         return '';
                            //}
                            return questionData[questionNumberLabels.indexOf(label)];



                            
                        }
                    }
                }
            }
        }
    });
}
