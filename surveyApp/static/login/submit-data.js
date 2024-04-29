function sendData() {
    // var name = document.getElementById('name').value;
    // var email = document.getElementById('email').value;

    var data='';
    if(left){
        data='student';
    }else{
        data='institute';
    }
    //console.log(data);

    // var csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    // $.ajax({
    //     url: '/',
    //     type: 'POST',
    //     data: {
    //         'uid':document.getElementById('user-id').value,
    //         'pass':document.getElementById('user-password').value,
    //         'typeoflogin': data,
    //         csrfmiddlewaretoken: csrftoken
    //     },
    //     success: function(response) {
    //         if(response.redirect_url){
    //             window.location.href = response.redirect_url;
    //         }
    //         else
    //         {
    //             console.log("chude gache")
    //         }
    //     },
    //     error: function(xhr, status, error) {
    //         console.error(error);
    //         // Handle error
    //     }
    // });

}