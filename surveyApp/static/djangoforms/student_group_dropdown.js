$(document).ready(function() {
    // Function to update groups dropdown
    function update_groups_dropdown(student_id, selectedGroup) {
        if (student_id) {
            $.ajax({
                url: '/admin/get_groups/',
                data: {'student_id': student_id},
                dataType: 'json',
                success: function(data) {
                    var select = $('#id_group');
                    var selected = select.val(); // Store the currently selected value
                    select.empty().append($('<option></option>').attr('value', '').text('---------')); // Add an empty option for the default value
                    $.each(data.groups, function(index, group) {
                        select.append($('<option></option>').attr('value', group.id).text(group.name));
                    });
                    if (selectedGroup) {
                        select.val(selectedGroup); // Set the selected group back to the previously selected one
                    }
                }
            });
        } else {
            $('#id_group').empty();  // Empty the groups dropdown if no student is selected
        }
    }

    // Function to handle change event of student dropdown
    $('#id_student').change(function() {
        var selectedStudent = $(this).val();
        var selectedGroup = $('#id_group').val(); // Store the currently selected group
        update_groups_dropdown(selectedStudent, selectedGroup); // Pass the selected group to update the groups dropdown accordingly
    });

    // Call the change event handler for student dropdown on page load
    $('#id_student').trigger('change');
});
