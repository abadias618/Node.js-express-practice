function upload(){

    var name = $('#shoe_name').val();
    var color = $('#shoe_color').val();
    var size = $('#shoe_size').val();
    var url = $('#url').val();

    var params = {
        name: name,
        color: color,
        size: size,
        url: url};

    $.post("/insert",params,function (result){
        if (result && result.success) {
            console.log('inserted element successfully');
        }
        else {
            console.log('something went wrong');
        }
    });

    /* Check if everything was introduced correctly */
    if (name && color && size && file) {
        
        
    }
    else {
        $('#status').text("Please Fill all of the fields");
    }
    
}
