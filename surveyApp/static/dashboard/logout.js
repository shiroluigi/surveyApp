function logout(){
    window.location.href = "/logout";
}
function goToSurvey(element) {
    // Get the value of the data-sid attribute from the clicked element
    var surveyId = element.getAttribute("data-sid");
    
    // Get the current path
    var currentPath = window.location.pathname;
    
    // Append the survey ID to the current path
    var newUrl = currentPath + "analysis/" +  String(surveyId);
    
    // Redirect the user to the new URL
    window.location.href = newUrl;
}

