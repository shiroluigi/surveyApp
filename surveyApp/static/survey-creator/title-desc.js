window.addEventListener('resize', ()=>{
    const x=document.getElementsByClassName('ip-field');
    for(let i=0;i<x.length;i++){
        adjustRows(x[i]);

    }
});
const x=document.getElementsByClassName('ip-field');
    for(let i=0;i<x.length;i++){
        adjustRows(x[i]);

    }


function adjustRows(textarea) {
    //   const numberOfLines = textarea.value.split('\n').length;
    //   textarea.rows = numberOfLines;

      textarea.style.height = 'auto'; // Reset height to auto to recalculate
      textarea.style.height = (textarea.scrollHeight) + 'px'; // Set height to the scrollHeight
    

    // textarea.rows = textarea.scrollHeight / parseFloat(window.getComputedStyle(textarea).getPropertyValue('font-size')); // 20 is an approximate height of one row
    // textarea.rows = textarea.scrollHeight /parseInt(getComputedStyle(textarea).lineHeight);
    // console.log(parseInt(getComputedStyle(textarea).lineHeight));
}