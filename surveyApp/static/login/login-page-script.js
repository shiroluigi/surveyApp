let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
    slides[i].classList.remove("fade"); // Remove 'fade' class from all slides
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  void slides[slideIndex-1].offsetWidth;
  slides[slideIndex - 1].classList.add("fade"); // Add 'fade' class to the current slide
  dots[slideIndex - 1].className += " active";
  setTimeout(showSlides, 8000); 
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

// Handle resize              *******************************************************************


function handleWindowResize() {
    const windowWidth = window.innerWidth;

    // Example: Change content based on window width
    if (windowWidth <= 1000) {
      // Display mobile content
      document.getElementById("d2").style.display="none";
    } else {
      // Display desktop content
      document.getElementById("d2").style.display="flex";
    }
  }

  // Call the function on page load and window resize
  window.addEventListener('load', handleWindowResize);
  window.addEventListener('resize', handleWindowResize);



  /////////////////////////////////////////////////////////////////////////////////////////////////

  var nb=document.getElementsByClassName('anim-button');
  //console.log(nb.length);
  for(let i=0;i<nb.length;i++){
      //console.log("HELPPPPPPPPP");
      nb[i].addEventListener('mousemove',enterAnim);
      nb[i].addEventListener('mouseleave',endAnim);
      //nb[i].querySelector('.circle');
      //nb[i].addEventListener('click',createNewSurvey);
  }

  // gsap.to('.circles',{duration:2,rotation:360,repeat:-1});
  
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