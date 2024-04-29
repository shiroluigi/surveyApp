// function scrollToTop() {
//     document.body.scrollTop = 0; 
//     document.documentElement.scrollTop = 0; 
//   }
  
//   function scrollToBottom() {
//     document.body.scrollTop = document.body.scrollHeight; 
//     document.documentElement.scrollTop = document.documentElement.scrollHeight; 
//   }
  
//   window.onscroll = function() {
//     const scrollToTopBtn = document.getElementById('scrollToTopBtn');
//     const scrollToBottomBtn = document.getElementById('scrollToBottomBtn');
  
//     scrollToTopBtn.style.display = (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? 'block' : 'none';
  
//     scrollToBottomBtn.style.display = (window.innerHeight + window.scrollY) < document.body.offsetHeight ? 'block' : 'none';
//   };


//   function getTotalPageLength() {
//     const totalPageHeight = Math.max(
//       document.body.scrollHeight,
//       document.body.offsetHeight,
//       document.documentElement.clientHeight,
//       document.documentElement.scrollHeight,
//       document.documentElement.offsetHeight
//     );
  
//     return totalPageHeight;
//   }
  
//   console.log("Total Page Length:", getTotalPageLength());
  


function smoothScroll(target) {
    
    const targetElement = document.querySelector(target);
    console.log(targetElement.offsetTop);
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: 'smooth'
    });
  }




