//window.addEventListener('resize', adjustFontSize);

document.addEventListener('DOMContentLoaded', function () {
    //adjustFontSize();
    companyAnim();
  });




// function adjustFontSize() {
    
//     const div1 = document.getElementById('company-first-name');
//     div1.style.fontSize=document.getElementById('d3').offsetWidth*0.05+'px';
//     console.log(div1.style.fontSIze);
//     const div3=document.getElementById('company-last-name');
//     div3.style.fontSize=document.getElementById('d3').offsetWidth*0.05*1.35+'px';

//     const div2=document.getElementById('company-tagline');
//     div2.style.fontSize=document.getElementById('d3').offsetWidth*0.07*0.4+'px';
// }

//adjustFontSize();

function companyAnim(){


    let tl=gsap.timeline();
    tl.from('#d1',{duration:1,opacity:0});
    tl.from(document.getElementById('part1'),{duration:1,opacity:0,translateX:'100%'});
    tl.from(document.getElementById('part2'),{duration:1,opacity:0,translateX:'-100%'},"<=");
    
    tl.from('.last-name-letters',{duration:0.5,stagger:0.08,opacity:0,translateY:'100%',ease:'back'});
    tl.from('#form',{duration:1,opacity:0});
    //tl.from('#button-div',{duration:0.5,scale:0},'<=');
    tl.from('#company-tagline',{duration:4,opacity:0},);
    
}