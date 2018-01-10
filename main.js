
const queryStringOptions = (function queryStringOptions(a) {
  if (a === "") return {};
  const b = {};
  for (let i = 0; i < a.length; ++i) {
    const p = a[i].split('=', 2);
    if (p.length === 1) {
      b[p[0]] = "";
    } else {
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
  }
  return b;
}(window.location.search.substr(1).split('&')));

let templateName = queryStringOptions.name ? queryStringOptions.name : 'objectsvr';

setup('objectsvr', 'form1');
setup('rainvr', 'form2');
setup('movievr', 'form3');

function setup(templateName, formId) {
  loadJSON(templateName, function (response) {
    let options = JSON.parse(response);

    let jumbotron = document.createElement('div');
    jumbotron.className = 'jumbotron';

    let heading = document.createElement('h1');
    heading.className = 'display-3';
    heading.innerText = options.title;
    jumbotron.appendChild(heading);

    let description = document.createElement('p');
    description.className = 'lead';
    description.innerHTML = options.description;
    jumbotron.appendChild(description);

    let all = document.getElementById('all');
    all.appendChild(jumbotron);

    let formElement = document.createElement('form');
    formElement.id = formId;

    let formContainer = document.createElement('div');
    formContainer.className = 'container';
    let row = document.createElement('div');
    row.className = 'row';
    formContainer.appendChild(row);
    let col = document.createElement('div');
    col.className = 'col';
    row.appendChild(col);
    col.appendChild(formElement);

    all.appendChild(formContainer);
    formContainer.appendChild(row);

    let samples;
    if (templateName === 'objectsvr') {
      samples = [
        '/objectsvr/?object=Bear_Brown&soundFile=bear2.mp3&color=black&',
        '/objectsvr/?object=Cat&soundFile=Cat2.mp3&color=black&'
      ];
    } else if (templateName === 'rainvr') {
      samples = [
        '/rainvr/?rainImage=raindrop.png&pano=pano1.jpg&particleNumber=30000&',
        '/rainvr/?rainImage=unicef.png&pano=pano1.jpg&particleNumber=1500&'
      ]
    } else if (templateName === 'movievr') {
      samples = [
        '/movievr/?videoUrl=animals.mp4&',
        '/movievr/?videoUrl=patagonia.mp4&'
      ]
    }

    let samplesDiv = document.createElement('div');
    jumbotron.appendChild(samplesDiv);
    let samplesHeading = document.createElement('h3');
    samplesHeading.innerText = 'Samples';
    samplesDiv.appendChild(samplesHeading);

    for (let j = 0; j < samples.length; j++) {
      let sampleItem = document.createElement('a');
      sampleItem.href = samples[j];
      sampleItem.target = '_blank';
      sampleItem.innerText = 'Sample' + (j+1);
      samplesDiv.appendChild(document.createElement('br'));
      samplesDiv.appendChild(sampleItem);
    }

    for (let i = 0; i < options.variables.length; i++) {
      var option = options.variables[i];
      if (option.type === 'text') {
        let divContainer = document.createElement('div');
        divContainer.className = 'form-group';
        let input = document.createElement('input');
        input.id = option.name;
        input.type = 'text';
        input.className = 'form-control';
        input.placeholder = option.name;
        divContainer.appendChild(input);
        formElement.appendChild(divContainer);
      } else if (option.type === 'dropdown') {
        let divContainer = document.createElement('div');
        divContainer.className = 'form-group';
        let selectGroup = document.createElement('select');
        selectGroup.id = option.name;
        selectGroup.className = 'form-control';
        divContainer.appendChild(selectGroup);
        for (j = 0; j < option.options.length; j++) {
          let optionValue = option.options[j];
          let optionItem = document.createElement('option');
          optionItem.value = optionValue;
          optionItem.text = optionValue;
          selectGroup.appendChild(optionItem);
        }
        formElement.appendChild(divContainer);
      } else if (option.type === 'number') {
        let divContainer = document.createElement('div');
        divContainer.className = 'form-group';
        let input = document.createElement('input');
        input.id = option.name;
        input.type = 'number';
        input.className = 'form-control';
        input.placeholder = option.name;
        divContainer.appendChild(input);
        formElement.appendChild(divContainer);
      }
    }
    let submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary';
    submitButton.innerText = 'Submit';
    formElement.appendChild(submitButton);

    let formItem = document.getElementById(formId);
    formItem.addEventListener('submit', function (event) {
      event.preventDefault();
      console.log(options)
      let queryString = '/?';

      for (let i = 0; i < options.variables.length; i++) {
        let option = options.variables[i];
        let field = document.getElementById(option.name);
        let value = field.value ? field.value : option.value;
        queryString = queryString + option.name + '=' + value + '&';
      }

      openInNewTab('/' + options.directory + queryString);

    });
  });
}

function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}


function loadJSON(templateName, callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', templateName + '/options.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}