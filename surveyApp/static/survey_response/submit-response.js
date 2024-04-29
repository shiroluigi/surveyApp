function submitResponse(){
    let data={};
    let jsonResponseArray=[];

    const q_list=document.getElementsByClassName('questions');

    
    // for(let i=0;i<q_list.length;i++){
    //     let choice=3;
    //     let options=q_list[i].getElementsByClassName('mcq-parent')[0].getElementsByClassName('anim-button');
    //     //console.log(options.length);
    //     let j=0;
    //     for(j=0;j<options.length;j++){
    //         if(options[j].classList.contains('selected')){
    //             choice=j+1;
    //             break;
    //         }
    //     }
    //     jsonResponseArray.push(choice);
        
    // }

    for(let i=0;i<q_list.length;i++){
        let choice=3;
        let options=q_list[i].getElementsByClassName('mcq-parent')[0].getElementsByClassName('anim-button');
        let j=0;
        for(j=0;j<options.length;j++){
            if(options[j].classList.contains('selected')){
                choice=j+1;
                break;
            }
        }
        data[String(q_list[i].getAttribute("data-qid"))]=choice;
        // jsonResponseArray.push(choice);
    }

    // data["responses"]=jsonResponseArray;

    console.log(JSON.stringify(data));

    //document.getElementById('submit-response-form').getElementsByTagName('input')[0].value=JSON.stringify(data);
    document.getElementById('response-data').value=JSON.stringify(data);
    document.getElementById('submit-response-form').submit();

}