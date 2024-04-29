var nb=document.getElementsByClassName('anim-button');
//console.log(nb.length);
for(let i=0;i<nb.length;i++){
    //console.log("HELPPPPPPPPP");
    nb[i].addEventListener('mousemove',enterAnim);
    nb[i].addEventListener('mouseleave',endAnim);
    nb[i].addEventListener('click',selectButton);
    //nb[i].querySelector('.circle');
    //nb[i].addEventListener('click',createNewSurvey);
}

gsap.to('.circles',{duration:1,rotation:360,repeat:-1});

//var isPlaying=false;
// var ntl=gsap.timeline({repeat:0});



function enterAnim(e){
    //console.log("in");
    
    // let c=document.getElementById("circle");
    let c=e.currentTarget.querySelector('.circles');
    // let c=t[0];
    //c.style.display='block';
    //console.log(e.offsetX);
    

    const div =e.currentTarget;//= document.getElementsByClassName('new-button');
    const rect = div.getBoundingClientRect();

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    c.style.left=mouseX+'px';
    c.style.top=mouseY+'px';

    // gsap.set(c,{left:e.mouseX,top:e.mouseY});

    if(!c.isPlaying){

        //console.log("in ANIM");
        c.isPlaying=true;
        c.style.display='block';
        
        gsap.fromTo(c,{scale:0},{duration:2,scale:1,ease:'back'});
    }
    //e.stopPropagation();
    
}

function endAnim(e){
    let c=e.currentTarget.querySelector('.circles');
    c.isPlaying=false;
    //console.log("Out");
    gsap.to(c,{duration:0.15,scale:0,onComplete:completed=>{
        c.style.display='none';
        c.isPlaying=false;
        //console.log('offf');
      }});
     
}

gsap.from(document.getElementById('d-main'),{duration:2,opacity:0});


function createSurveyButton(){
    window.location.href = "/institute-dashboard/question-creator/";
}