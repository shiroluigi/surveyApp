function closeDiv(){
    // gsap.set('#instructions',{padding:0,margin:0});
    gsap.to('#instructions',{duration:0.5,height:0,padding:0,margin:0,onComplete: function() {
            document.getElementById('instructions').remove();
      }});
}