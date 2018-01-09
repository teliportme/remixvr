let formElement = document.getElementById('form');
let options;

init();

function init() {
  loadJSON(function (response) {
    options = JSON.parse(response);
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
      }
    }
    let submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary';
    submitButton.innerText = 'Submit';
    formElement.appendChild(submitButton);
  });
}

formElement.addEventListener('submit', function(event) {
  event.preventDefault();
  let queryString = '/?';

  for (let i = 0; i < options.variables.length; i++) {
    let option = options.variables[i];
    let field = document.getElementById(option.name);
    let value = field.value ? field.value : option.value;
    queryString = queryString + option.name + '=' + value + '&';
  }

  openInNewTab('/' + options.directory + queryString);

});


function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}


function loadJSON(callback) {

  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', 'objectsVR/options.json', true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}