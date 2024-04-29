function createSurvey(){
    let isValid=true;
    let data={};
    let jsonGroupsArray=[];
    let jsonQuestionsArray=[];
    const q_list=document.getElementById('questions-list');
    const allQs=document.getElementsByClassName('questions');
    // // data["csrfmiddlewaretoken"]=document.querySelector("#csrf input").value;
    // var csrfToken = document.getElementsByName('csrfmiddlewaretoken').value;
    
    data["title"]=document.getElementById('ip-title').value.toString().trim();
    data["desc"]=document.getElementById('ip-desc').value.toString().trim();
    // data["csrfmiddlewardetoken"]=csrfToken;

    const groups=document.getElementsByClassName('groups');

    for(let i=0;i<groups.length;i++){
        if(groups[i].classList.contains('selected')){
            jsonGroupsArray.push(groups[i].textContent.toString().trim());
        }
        
    }


    for(let i=0;i<allQs.length;i++){
        let x=allQs[i].getElementsByClassName('ip-field');
        if(x[0].value==''){
            alert('Question '+(i+1)+' empty');
            break;
            isValid=false;
        }
        jsonQuestionsArray.push(x[0].value.toString().trim());
    }

    data["groups"]=jsonGroupsArray;

    data["questions"]=jsonQuestionsArray;

    console.log(JSON.stringify(data));

    document.getElementById('submit-data-form').getElementsByTagName('input')[1].value=JSON.stringify(data);
    document.getElementById('submit-data-form').submit();
}