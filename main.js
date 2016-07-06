function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.target.files; // FileList object

  return showSelectedFiles(files);
}

function handleFileDrop(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object

  return showSelectedFiles(files);
}

function showSelectedFiles(files) {

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
    previewImage(f);
  }
  document.getElementById('list').innerHTML = document.getElementById('list').innerHTML +
    '<ul>' + output.join('') + '</ul>';
}

function previewImage(f) {

  // Only process image files.
  if (f.type.match('image.*')) {

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
      return function(e) {
        // Render thumbnail.
        var span = document.createElement('span');
        span.innerHTML = ['<img class="thumb" src="', e.target.result,
                          '" title="', escape(theFile.name), '"/>'].join('');
        document.getElementById('preview').insertBefore(span, null);
      };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
  }
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileDrop, false);

document.querySelectorAll('.file-loader').forEach(function (elem) {
  elem.addEventListener('change', handleFileSelect, false);
});

//document.getElementById('files').addEventListener('change', handleFileSelect, false);
//document.getElementById('file').addEventListener('change', handleFileSelect, false);

// customize file selector
var fileSelect = document.getElementById("fileSelect"),
    fileElem = document.getElementById("fileElem");

fileSelect.addEventListener("click", function (e) {
  e.preventDefault(); // prevent navigation to "#"
  if (fileElem) {
    fileElem.click();
  }
}, false);
