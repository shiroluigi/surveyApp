function createQuestionElement(){
    // creating the wuestion element

    let q=document.createElement('div');
    q.className='questions';
    q.setAttribute('draggable','false');
    q.setAttribute('data-qNumber','0');

    //
    q.addEventListener('dragstart',()=>{
        //console.log('dragstart');
        q.classList.add('dragging');
    });

    q.addEventListener('drag',(e)=>{
        //console.log('draginggg');
        
        var scrollSpeed = 1;
        if (e.clientY < 50) {
            scrollSmoothly(-scrollSpeed);
        } else if (e.clientY > window.innerHeight - 50) {
            scrollSmoothly(scrollSpeed);
        }

        q.classList.add('dragging');
    });

    q.addEventListener('dragend',()=>{
        //console.log('drag end');
        q.classList.remove('dragging');
        reCalculatePosition();
    });


    let qNo=document.createElement('div');
    qNo.className='q-number';
    qNo.innerHTML='j';

    q.appendChild(qNo);

    let drag_ico=document.createElement('div');
    drag_ico.className='drag-ico';

    drag_ico.addEventListener('mousedown',enableDragging);
    drag_ico.addEventListener('mouseleave',disableDragging);



    q.appendChild(drag_ico);

    // let t=document.createElement('div');
    // t.appendChild(qNo);
    // t.appendChild(drag_ico);

    //  q.appendChild(t);

    let q_text=document.createElement('textarea');
    q_text.setAttribute('type','text');
    q_text.className='ip-field';
    q_text.setAttribute('placeholder','Write Q');
    q_text.setAttribute('rows','2');
    q_text.setAttribute('cols','1000');
    q_text.setAttribute('oninput','adjustRows(this)');
    q_text.setAttribute('wrap','hard');

    q.appendChild(q_text);

    let mcq_parent=document.createElement('div');
    mcq_parent.className='mcq-parent';



    let cir1=document.createElement('div');
    cir1.className='circles';
    let cir2=document.createElement('div');
    cir2.className='circles';
    let cir3=document.createElement('div');
    cir3.className='circles';
    let cir4=document.createElement('div');
    cir4.className='circles';
    let cir5=document.createElement('div');
    cir5.className='circles';

    let o1=document.createElement('div'); // option 1
    o1.className='anim-button';
    o1.classList.add('no-border');
    o1.setAttribute('data-isPlaying','false');
    o1.innerHTML="1";
    o1.appendChild(cir1);

    let o2=document.createElement('div'); // option 2
    o2.className='anim-button';
    o2.setAttribute('data-isPlaying','false');
    o2.innerHTML="2";
    o2.appendChild(cir2);

    let o3=document.createElement('div'); // option 3
    o3.className='anim-button';
    o3.setAttribute('data-isPlaying','false');
    o3.innerHTML="3";
    o3.appendChild(cir3);

    let o4=document.createElement('div'); // option 4
    o4.className='anim-button';
    o4.setAttribute('data-isPlaying','false');
    o4.innerHTML="4";
    o4.appendChild(cir4);

    let o5=document.createElement('div'); // option 5
    o5.className='anim-button';
    o5.setAttribute('data-isPlaying','false');
    o5.innerHTML="5";
    o5.appendChild(cir5);

    gsap.to(cir1,{duration:1,rotation:360,repeat:-1});
    gsap.to(cir2,{duration:1,rotation:360,repeat:-1});
    gsap.to(cir3,{duration:1,rotation:360,repeat:-1});
    gsap.to(cir4,{duration:1,rotation:360,repeat:-1});
    gsap.to(cir5,{duration:1,rotation:360,repeat:-1});

    mcq_parent.appendChild(o1);
    mcq_parent.appendChild(o2);
    mcq_parent.appendChild(o3);
    mcq_parent.appendChild(o4);
    mcq_parent.appendChild(o5);

    // q.appendChild(mcq_parent);


    let q_ops=document.createElement('div');
    q_ops.className='q-options';
    q_ops.addEventListener('click',deleteCurrentQuestion);

    q.appendChild(q_ops);
    
    


    return q;

}

// element creation done

// create survey event listener

document.getElementById('tools-panel').addEventListener('mousedown',createQuestion);



function createQuestion(){
    let x=createQuestionElement();
    document.getElementById('questions-list').appendChild(x);
    //console.log("fewpijgwi");
    window.scrollTo(0, document.body.scrollHeight);
    // adding event listeners to newly created
    var nb=document.getElementsByClassName('anim-button');
    reCalculatePosition();
    for(let i=0;i<nb.length;i++){
        nb[i].addEventListener('mousemove',enterAnim);
        nb[i].addEventListener('mouseleave',endAnim);
    }

    gsap.from(x,{duration:0.5,opacity:0,scale:0});

    //x.getElementsByClassName('ip-field')[0].focus();
    //console.log("Total Page Length:", getTotalPageLength());

}

//document.getElementById('questions-list').appendChild(createQuestionElement());
// document.getElementById('questions-list').appendChild(createQuestionElement());


function deleteCurrentQuestion(e){
    gsap.to(e.currentTarget.parentNode,{duration:0.4,opacity:0,scale:0,onComplete:removeElement,onCompleteParams:[e.currentTarget.parentNode]});
    
    //console.log('dell');
}

function removeElement(x){
    x.remove();
    reCalculatePosition();
}

function enableDragging(e){
    e.currentTarget.parentNode.setAttribute('draggable','true');
}

function disableDragging(e){
    e.currentTarget.parentNode.setAttribute('draggable','false');
}


function scrollSmoothly(scrollAmount) {
    var startTime;
    var startScrollTop = window.scrollY;

    function scrollStep(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = timestamp - startTime;

      window.scrollTo(0, startScrollTop + progress * scrollAmount);

      if (progress < 200) {
        requestAnimationFrame(scrollStep);
      }
    }

    requestAnimationFrame(scrollStep);
  }