const grps=document.getElementsByClassName('anim-button');
for(let i=0;i<grps.length;i++){
    grps[i].addEventListener('click',function(){
        select_grp(grps[i]);
    });
}

function select_grp(grp){
    if(grp.classList.contains('selected')){
        grp.classList.remove('selected');
    }else{
        let buttons=grp.parentNode.getElementsByClassName('anim-button');
        for(let i=0;i<buttons.length;i++){
            if(buttons[i].classList.contains('selected')){
                buttons[i].classList.remove('selected');
            }
        }
        grp.classList.add('selected');
    }
    
}
