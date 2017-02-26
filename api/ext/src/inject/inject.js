chrome.runtime.sendMessage({}, function(response) {
    $(document).ready(function(){

        var makePopover = function() {
            var popover = document.createElement("div");
            popover.setAttribute("class", "container");
            popover.setAttribute("style", "display: inline; float:right");
            var a = document.createElement("a");
            a.setAttribute("href", "#");
            a.setAttribute("title", "Rate this article");
            a.setAttribute("data-toggle", "popover");
            //a.setAttribute("data-trigger", "focus");
            a.setAttribute("data-html", "true");
            a.setAttribute("width", "500px");

            var form =
            '<style>'+
                '.popover {'+
                  'max-width: 600px;'+
                  'width: auto;'+
                '}'+
            '</style>'+

            '<form class="form-horizontal">' +
            '<fieldset>' +
            '<div class="form-group">' +
              '<div class="col-md-4" style="width: 100%"> ' +
                '<label class="radio-inline" for="radios-0">' +
                  '<input type="radio" name="radios" id="radios-0" value="1">' +
                  '1' +
                '</label> ' +
                '<label class="radio-inline" for="radios-1">' +
                  '<input type="radio" name="radios" id="radios-1" value="2">' +
                  '2' +
                '</label> ' +
                '<label class="radio-inline" for="radios-2">'+
                  '<input type="radio" name="radios" id="radios-2" value="3">'+
                  '3' +
                '</label>' +
                '<label class="radio-inline" for="radios-3">'+
                  '<input type="radio" name="radios" id="radios-3" value="4">'+
                  '4' +
                '</label>'+
                '<label class="radio-inline" for="radios-4">'+
                  '<input type="radio" name="radios" id="radios-4" value="5" checked="checked">'+
                  '5' +
                '</label>'+
              '</div>'+
            '</div>'+

            '<div class="form-group" style="width: 100%">' +
              '<div class="col-md-12">'+
                '<textarea class="form-control" id="textarea" name="textarea" placeholder="optional comment..."></textarea>'+
              '</div>'+
            '</div>'+

            '<div class="form-group" style="width: 100%">'+
              '<div class="col-md-8">'+
                '<button id="button1id" name="button1id" class="btn btn-success">Submit</button>'+
              '</div>'+
            '</div>'+

            '</fieldset>'+
            '</form>' +

            // $("#idForm").submit(function(e) {

            //     var url = "path/to/your/script.php"; // the script where you handle the form input.

            //     $.ajax({
            //            type: "POST",
            //            url: url,
            //            data: $("#idForm").serialize(), // serializes the form's elements.
            //            success: function(data)
            //            {
            //                alert(data); // show response from the php script.
            //            }
            //          });

            //     e.preventDefault(); // avoid to execute the actual submit of the form.
            // });

            a.setAttribute("data-content", form);
            a.innerText = "Click Me!";
            popover.append(a);

            return popover;
        }

        try {

            var metaAuthor = document.head.querySelector("[name=author]");
            if (metaAuthor.content != undefined) {
                metaAuthor = metaAuthor.content;
            }
            console.log(metaAuthor);
            var authorBody = document.getElementsByClassName('metadata__byline__author')[0];
            authorBody.parentElement.setAttribute("style", "display: inline; float: left");

            authorBody.parentElement.append(makePopover());
            $('[data-toggle="popover"]').popover({ container: 'body'});


        } catch (e) {

            console.log("No author found");
        }
    });
});