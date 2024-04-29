const grps=document.getElementsByClassName('groups');
for(let i=0;i<grps.length;i++){
    grps[i].addEventListener('click',function(){
        select_grp(grps[i]);
    });
}

function select_grp(grp){
    if(grp.classList.contains('selected')){
        grp.classList.remove('selected');
    }else{
        grp.classList.add('selected');
    }
    
    console.log("fefwgw");
}
