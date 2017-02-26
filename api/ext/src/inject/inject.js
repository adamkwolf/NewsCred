chrome.runtime.sendMessage({}, function(response) {
  $(document).ready(function(){
    var submitHandler = function(e) {
      var comment = $("#comment-field").value;
      var rating = $("input[name='art-score']:checked").value;
      e.preventDefault()
    };

    var makePopover = function() {
      // var popover = document.createElement("div");
      var popover = document.createElement("div");
      popover.setAttribute("id", "popover");
      popover.setAttribute("style", "display: inline-block; float:right;");
      // a.setAttribute("href", "#");
      popover.setAttribute("title", "Rate this article");
      // a.setAttribute("data-toggle", "popover");
      //a.setAttribute("data-trigger", "focus");
      popover.setAttribute("data-html", "true");
      popover.setAttribute("width", "500px");

      var form =
      '<form id="newscred-form">' +
      '<fieldset>' +
      '<div class="form-group">' +
      '<div class="col-md-4" style="width: 100%; display: flex; flex-direction: row; margin: 10px 0px;"> ' +
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

      '<div class="form-group" style="width: 100%; margin: 10px 0px;">' +
      '<div class="col-md-12">'+
      '<textarea class="form-control" id="comment-field" name="textarea" placeholder="optional comment..."></textarea>'+
      '</div>'+
      '</div>'+

      '<div class="form-group" style="width: 100%;">'+
      '<div style="text-align: right; padding: 10px 20px;">'+
      '<input type="button" id="newscred-submit" name="button1id" class="btn btn-success" value="Submit"></input>'+
      '</div>'+
      '</div>'+

      '</fieldset>'+
      '</form>';

      popover.innerHTML = form;
      // a.innerText = "Click Me!";
      // popover.append(a);

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
      authorBody.parentElement.setAttribute("data-html", "true");
      var popover = makePopover();
      // console.log(popover);
      authorBody.parentElement.appendChild(makePopover());
      var popup = document.getElementById('popover');
      popup.setAttribute("style", "width: 800px; z-index: 9999; margin: 40px 20px;")

      // console.log($("#newscred-submit").length);
      // $('[data-toggle="popover"]').popover({ container: 'body'});
      $("#newscred-submit").click(submitHandler);
      // console.log(JSON.stringify($('.form-horizontal').serializeArray()));
    } catch (e) {
      console.log("No author found");
    }
  });
});
