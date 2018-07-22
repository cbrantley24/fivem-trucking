var documentWidth = document.documentElement.clientWidth;
var documentHeight = document.documentElement.clientHeight;

var cursor = document.getElementById("cursor");
var cursorX = documentWidth / 2;
var cursorY = documentHeight / 2;

function UpdateCursorPos() {
    cursor.style.left = cursorX;
    cursor.style.top = cursorY;
}

function Click(x, y) {
    var element = $(document.elementFromPoint(x, y));
    element.focus().click();
    return true;
}

$(function() {
    window.addEventListener('message', function(event) {
        if (event.data.type == "enableui") {
            cursor.style.display = event.data.enable ? "block" : "none";
            document.body.style.display = event.data.enable ? "block" : "none";
            if (event.data.enable == true) {
                $.post('http://trucking/updatejobs', JSON.stringify({}));
            }
        } else if (event.data.type == "click") {
            // Avoid clicking the cursor itself, click 1px to the top/left;
            Click(cursorX - 1, cursorY - 1);
        } else if (event.data.type == "updatejobs") {
            $(".area").html(event.data.jobs)
        }
    });

    $(document).mousemove(function(event) {
        cursorX = event.pageX;
        cursorY = event.pageY;
        UpdateCursorPos();
    });

    document.onkeyup = function (data) {
        if (data.which == 27) { // Escape key
            $.post('http://trucking/escape', JSON.stringify({}));
        }
    };

    $("#close").click(function() {
        $.post('http://trucking/escape', JSON.stringify({}));
    });

    $(".play").click(function() {
        var id = $(this).data("id")
        $.post('http://trucking/job', JSON.stringify(id));
    });

    $("#login-form").submit(function(e) {
        e.preventDefault(); // Prevent form from submitting
        
        $.post('http://ui-mouse-example/login', JSON.stringify({
            username: $("#username").val(),
            password: $("#password").val()
        }));
    });
});
