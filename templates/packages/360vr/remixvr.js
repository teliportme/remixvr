export function fetchProjectData(callback) {
  const regex = /project\/(.*)\/view/g;
  const match = regex.exec(window.location.href);
  const projectSlug = match[1];

  if (projectSlug) {
    const url = `https://api.staging.remixvr.org/api/projects/${projectSlug}/spaces`;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        const spaces = JSON.parse(xmlHttp.responseText);
        window.remixvrspaces = spaces;
        callback(spaces);
      }
    };
    xmlHttp.open('GET', url, true); // true for asynchronous
    xmlHttp.send(null);
  }
}

function findSpace(id) {
  let results = null;
  const data = window.remixvrspaces;
  // iterate over each element in the array
  for (var i = 0; i < data.length; i++) {
    // look for the entry with a matching `code` value
    if (data[i]['id'] === id) {
      // we found it
      // obj[i].name is the matched result
      results = data[i];
    }
  }
  return results;
}

export function fetchSpace(id, callback) {
  const existingSpace = window.remixvrspaces && findSpace(parseInt(id));
  if (!existingSpace) {
    const url = `https://api.staging.remixvr.org/api/spaces/${id}`;
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        const space = JSON.parse(xmlHttp.responseText);
        callback(space);
      }
    };
    xmlHttp.open('GET', url, true); // true for asynchronous
    xmlHttp.send(null);
    return;
  }
  callback(existingSpace);
}

export function getValues(data, key, value) {
  const results = [];
  // iterate over each element in the array
  for (var i = 0; i < data.length; i++) {
    // look for the entry with a matching `code` value
    if (data[i][key] == value) {
      // we found it
      // obj[i].name is the matched result
      results.push(data[i]);
    }
  }
  return results;
}
