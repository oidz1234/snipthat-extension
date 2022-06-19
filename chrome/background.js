function onCreated() {
  if (chrome.runtime.lastError) {
    console.log("error creating item:" + chrome.runtime.lastError);
  } else {
    console.log("item created successfully");
  }
}

function get_uuid() {
    try {
        uuid = chrome.storage.local.get('uuid')
        console.log(uuid)
        return uuid
    } catch(e) {
        console.log(e);
        return gen_uuid()

    }

    // check for uuid in local storage
    // if there is not one gen one
}
//const send_endpoint = 'http://localhost:8000/api/save/';
const send_endpoint = 'https://snipthat.io/api/save/';
//let last_response = 'placeholder';

function uuid_got(item) {
    uuid = item['uuid']
    if (uuid == undefined) {
        console.log('we got uuid but it has nothing Sad')
        uuid = gen_uuid()
    }
}

function uuid_not(e) {
    console.log('we don\'t have a uuid')
    uuid = gen_uuid()
    console.log('we do now...:' + uuid)
    
}
uuid = chrome.storage.local.get('uuid')
uuid.then(uuid_got, uuid_not);

// ran once (I think)

//const uuid = get_uuid() 

async function send_text(text, url) {
    console.log('will send this:');
    console.log(text);
    json = build_json(text, url)
    try {
        let api_response = await send_json_to_api(json)
        console.log(await api_response)
    } catch(e) {
        console.log(e);
    }
}



    // call json = build_json(text) function
    // call send_json_to_api(json) function
    //



/*
async function get_url() {
   url = browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let tab = tabs[0]; // Safe to assume there will only be one result
        console.log(tab.url);
        return tab.url
    }, console.error)
    return url
}
*/

function get_iso_time() {
    t = new Date()
    z = t.getTimezoneOffset() * 60 * 1000
    tLocal = t-z
    tLocal = new Date(tLocal)
    iso = tLocal.toISOString()
    return iso
}

function build_json(text, url) {
    console.log(`oh boy this is some json with ${url} and ${text}`)

    json = JSON.stringify({
    "text": text,
    "source_url": url,
    "ip": "1.1.1.1",
    "user_uuid": uuid,
    //"datetime": new Date().toISOString()
    "datetime": get_iso_time()

    })
    /*
    json = `{
    "text": "${text}",
    "source_url": "${url}",
    "ip": "1.1.1.1"
    }`
    */
    gjson = json
    return json

}

async function send_json_to_api(json) {
  fetch(send_endpoint, {
  method: "POST",
  // literally only here for brave
  credentials: "omit",
  headers: {'Content-Type': 'application/json'},
  body: json
    }).then(res => {
      last_response = res;
      console.log("Request complete! response:", res);
      // send message here
        /*
      chrome.runtime.sendMessage({result: res.statusText}, function(response) {
          console.log(response)
});
*/
      return res
    });
}





// could do this with some oninstalled thing
function gen_uuid() {
    // gen uuid
    // store in local storage
    stored_uuid = crypto.randomUUID()
    chrome.storage.local.set({'uuid': stored_uuid})
    return stored_uuid
}

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function get_selection() {
    return window.getSelection().toString();
}

chrome.contextMenus.create({
  id: "log-selection",
  title: "Snip '%s'",
  contexts: ["selection"]
}, onCreated);

chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "log-selection") {
      // we have to execute this like this because chrome does not preserve
      // newlines of selected text
      tabId = getCurrentTab();
      tabId.then(function(result) {
         chrome.scripting.executeScript( {
             target: {tabId: result.id},
             func: get_selection,
         },
             (results) => {
                 console.log(results[0].result)
                 send_text(results[0].result, info.pageUrl)



          /*


        }, function(selection) {
            // selected contains text including line breaks
            selected = selection[0];
            send_text(selected, info.pageUrl)
*/
    });
      });

  }
});

// if chorme finally prserves newlines we can use this function instead

/*
 chrome.tabs.executeScript( {
	code: "window.getSelection().toString();"
}, function(selection) {
	// selected contains text including line breaks
	var selected = selection[0];
});
*/

// could be a switch statement
// also where we store the login in the future
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      if ('uuid' in request) {
          console.log('we need a uuid')
          sendResponse({"uuid": uuid});

      } else if ('last_response' in request) {
          if (last_response) {
            sendResponse({'last_response': last_response.statusText})
          }
      };
  }
);
