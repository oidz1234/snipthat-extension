// get uuid either from storage or background script ✅
// pass this to the html and display it ✅
//
//
// logins eventually
// might have to use runtime.sendMessage() to send data
// https://developer.chrome.com/docs/extensions/mv3/messaging/
// it should be a single request when updated to the background page
// as the background page will store the login keys or wahtever
// login, then send the data in a one time message to the background page ezpz
// this background page stores the data in the local storage
// then we can see if we can get a login like we get the uuid/status

const endpoint = "https://snipthat.io/"


/*
uuid = 'no' //chrome.extension.getBackgroundPage().uuid
console.log(uuid)
// this has to load after the page loads (hense defer = true)
document.getElementById('uuid_display').innerHTML=uuid
*/

chrome.runtime.sendMessage({'uuid': 'please'}, function(response) {
    console.log(response.uuid)
    uuid = response.uuid
    document.getElementById('uuid_display').innerHTML=uuid
    endpoint_link = endpoint + `uuid/${uuid}`
    var html_link = document.createElement('a');

    html_link.setAttribute('href', endpoint_link);
    html_link.setAttribute('target', 'blank');
    html_link.setAttribute('rel', 'noopener noreferrer');
    html_link.innerHTML = 'Click to view your snippets yeah boi'
    document.getElementById('snip_header').appendChild(html_link)
});


chrome.runtime.sendMessage({'last_response': 'please'}, function(response) {
    console.log(response)
    last_response = response.last_response // chrome.extension.getBackgroundPage().last_response.statusText
    document.getElementById('status_display').innerHTML=last_response
});




/*
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log( "from the extension");
      console.log(request.result)
      sendResponse({farewell: "goodbye"});
      // update popup html with request.result
      document.getElementById('status_display').innerHTML=request.result
      

  }
);
*/
