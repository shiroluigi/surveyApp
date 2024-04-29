
document.addEventListener('DOMContentLoaded', function() {
    renderImportanceGraph();
});

function renderImportanceGraph(){

    var jsonData={
        "Q1": {
            "question_content": "How satisfied are you with the quality of the product?",
            "coefficient_of_impact": -0.01818181818181791,
            "mean_response": 3.9
        },
        "Q2": {
            "question_content": "How satisfied are you with the delivery time?",
            "coefficient_of_impact": -0.03636363636363621,
            "mean_response": 3.2
        },
        "Q3": {
            "question_content": "How satisfied are you with the customer service?",
            "coefficient_of_impact": -0.024242424242424065,
            "mean_response": 4.4
        },
        "Q4": {
            "question_content": "How satisfied are you with the pricing?",
            "coefficient_of_impact": -0.03636363636363621,
            "mean_response": 3.2
        },
        "Q5": {
            "question_content": "How satisfied are you with the user interface?",
            "coefficient_of_impact": -0.024242424242424065,
            "mean_response": 4.4
        },
        "Q6": {
            "question_content": "How satisfied are you with the packaging?",
            "coefficient_of_impact": -0.03636363636363621,
            "mean_response": 3.2
        },
        "Q7": {
            "question_content": "How satisfied are you with the shipping process?",
            "coefficient_of_impact": -0.024242424242424065,
            "mean_response": 4.4
        },
        "Q8": {
            "question_content": "How satisfied are you with the payment process?",
            "coefficient_of_impact": 3.3306690738754696e-16,
            "mean_response": 5.0
        },
        "Q9": {
            "question_content": "How satisfied are you with the variety of products?",
            "coefficient_of_impact": -0.024242424242424065,
            "mean_response": 4.4
        },
        "Q10": {
            "question_content": "How satisfied are you with the after-sales service?",
            "coefficient_of_impact": 0.07878787878787902,
            "mean_response": 3.7
        }
    };

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
