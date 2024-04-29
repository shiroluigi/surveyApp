function dragAndDrop(){
    const draggables=document.querySelectorAll('.questions');
    const container=document.getElementById('questions-list');

    draggables.forEach(draggable =>{
        draggable.addEventListener('dragstart',()=>{
            //console.log('dragstart');
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('drag',(e)=>{
            //console.log('draginggg');
            
            var scrollSpeed = 1;
            if (e.clientY < 100) {
                scrollSmoothly(-scrollSpeed);
            } else if (e.clientY > window.innerHeight - 100) {
                scrollSmoothly(scrollSpeed);
            }

            q.classList.add('dragging');
        });

        draggable.addEventListener('dragend',()=>{
            //console.log('drag end');
            draggable.classList.remove('dragging');
            reCalculatePosition();
        });
    });

    container.addEventListener('dragover',e=>{
        e.preventDefault();
        const afterElement=getDragAfterElement(container,e.clientY);
        const dd=document.querySelector('.dragging');
        if(afterElement==null){
            container.appendChild(dd);
        }else{
            container.insertBefore(dd,afterElement);
        }

        
    });

    reCalculatePosition();
}

function getDragAfterElement(container,y){
    const draggableElements=[...container.querySelectorAll('.questions:not(.dragging)')];
    return draggableElements.reduce((closest,child)=>{
        const box=child.getBoundingClientRect();
        const offset=y-box.top-box.height/2;
        //console.log(offset);
        if(offset<0 && offset>closest.offset){
            return {offset:offset,element:child}
        }else{
            return closest;
        }
    },{offset:Number.NEGATIVE_INFINITY}).element;

}

//let dragging=false;

function reCalculatePosition(){
    //console.log("fwef");
    const divs=document.getElementsByClassName('questions');
    for(let i=0;i<divs.length;i++){
        divs[i].setAttribute('qNumber',(i+1)+'');
        divs[i].getElementsByClassName('ip-field').value=divs[i].getAttribute('data-qNumber');
        divs[i].getElementsByClassName('q-number')[0].innerHTML='Q'+(i+1);
        //console.log(divs[i].getElementsByClassName('q-number')[0]);
    }
}

dragAndDrop();