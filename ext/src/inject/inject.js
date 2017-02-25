chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		var url = document.URL;
		var sites = [
			"http://www.cnn.com/"
		]

		// <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
		// <link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.indigo-pink.min.css">
		// <script defer src="https://code.getmdl.io/1.3.0/material.min.js"></script>

		// var link = document.createElement("link");
		// link.href = "http://example.com/mystyle.css";
		// link.type = "text/css";
		// link.rel = "stylesheet";
		// document.getElementsByTagName("head")[0].appendChild(link);

		// var createLink(rel, href) {
		// 	var link = document.createElement("link");
		// 	link.href = href;
		// 	link.rel = rel
		// }

		// var createScript() {
			
		// }

		try {
			//for (var i = 0; i < sites.length; i++) {

				var metaAuthor = document.head.querySelector("[name=author]");
				if (metaAuthor.content != undefined) {
					metaAuthor = metaAuthor.content;
				}
				console.log(metaAuthor);

				var div = document.createElement("div");
				div.setAttribute("id", "authorsId");
				div.innerText = "Test Element";
				var authorBody = document.getElementsByClassName('metadata__byline__author')[0];
				authorBody.append(div);

				// if (url.includes(sites[i])) {
				// 	var authorObj = document.getElementsByClassName('metadata__byline__author')[0];
				// 	var author;
				// 	if (authorObj.length != 0) {
				// 		author = authorObj.innerText.substring(3, authorObj.innerText.length - 5);
				// 	} else {
				// 		author = authorObj.children[0].innerText;
				// 	}
					
				// 	console.log({
				// 		author: author,
				// 		url: document.URL
				// 	});

				// 	break
				// }


			//}
		} catch (e) {
			// do nothing
			console.log("No author found");
		}

	}
	}, 10);
});