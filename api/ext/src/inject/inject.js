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

            var script = document.createElement("script");

            var form =
            '<style>'+
                '.popover {'+
                  'max-width: 600px;'+
                  'width: auto;'+
                '}'+
            '</style>'+

            '<form id="newscred-form">' +
            '<fieldset>' +
            '<div class="form-group">' +
              '<div class="col-md-4" style="width: 100%"> ' +
                '<label class="radio-inline" for="radios-0">' +
                  '<input type="radio" name="art-score" id="radios-0" value="1">' +
                  '1' +
                '</label> ' +
                '<label class="radio-inline" for="radios-1">' +
                  '<input type="radio" name="art-score" id="radios-1" value="2">' +
                  '2' +
                '</label> ' +
                '<label class="radio-inline" for="radios-2">'+
                  '<input type="radio" name="art-score" id="radios-2" value="3">'+
                  '3' +
                '</label>' +
                '<label class="radio-inline" for="radios-3">'+
                  '<input type="radio" name="art-score" id="radios-3" value="4">'+
                  '4' +
                '</label>'+
                '<label class="radio-inline" for="radios-4">'+
                  '<input type="radio" name="art-score" id="radios-4" value="5" checked="checked">'+
                  '5' +
                '</label>'+
              '</div>'+
            '</div>'+

            '<div class="form-group" style="width: 100%">' +
              '<div class="col-md-12">'+
                '<textarea class="form-control" id="comment-field" name="textarea" placeholder="optional comment..."></textarea>'+
              '</div>'+
            '</div>'+

            '<div class="form-group" style="width: 100%">'+
              '<div class="col-md-8">'+
                '<input type="submit" id="button1id" name="button1id" class="btn btn-success">Submit</input>'+
              '</div>'+
            '</div>'+

            '</fieldset>'+
            '</form>'+
            '<script>'+
                '$("#newscred-form").submit(function(e) {'+
                    'console.log($("#comment-field").value);'+
                    'console.log($("input[name=&quot;art-score]:checked").value);'+
                    'e.preventDefault();'+
                '});'+
            '</script>';

            // var form2 =   '<form>' +
            //     '<input type="radio" name="foo" value="1" checked="checked" />' +
            //     '<input type="radio" name="foo" value="0" />' +
            //     '<input name="bar" value="xxx" />' +
            //     '<select name="this">' +
            //     '<option value="hi" selected="selected">Hi</option>' +
            //     'option value="ho">Ho</option>' +
            //     '</select>' +
            //     '</form>';

            a.setAttribute("data-content", form);
            a.innerText = "Click Me!";
            popover.append(a);

            return popover;
        };

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

            console.log(JSON.stringify($('.form-horizontal').serializeArray()));
        } catch (e) {

            console.log("No author found");
        }
    });
});