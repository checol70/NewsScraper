
$("#scrape").on("click", function(){
    $.ajax("/scrape",{
        method: "GET"
    }).then(function(){
        location.reload();
    })
})
$(".add-note").on("click", function(){
    var id = $(this).attr("data-id")
    var bod = $("#body"+ id).val().trim()
    var t = $("#title"+ id).val().trim()
    var obj ={
        title: t,
        body: bod
    }

    $.ajax("/notes/"+ id, {
        method:"POST",
        data: obj
    }).then(function(){
        location.reload();
    })
})
$(".remove-note").on("click", function(){
    var id = $(this).attr("data-id");
    console.log("Working on deleting")
    $.ajax("/notes/delete/"+ id, {
        method:"PUT"
    }).then(function(){
        location.reload();
    })
})