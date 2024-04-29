var left=true;

function moveLeft(){
    if(!left){
        gsap.to('#t-highlighter',{duration:0.4,x:"0%"});
        left=true;
        document.getElementById("toogle").value='student';
        console.log(document.getElementById("toogle").value);
    }

}

function moveRight(){
    if(left){
        gsap.to('#t-highlighter',{duration:0.4,x:"100%"});
        document.getElementById("toogle").value='institute';
        left=false;
        console.log(document.getElementById("toogle").value);
    }
}