$(function () {
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

  function uploadFile(file) {
    var reader = new FileReader();
    var xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("load", function(e) {
      console.log('xhr load event', e);
    }, false);

    xhr.open("POST", "/upload");

    reader.onload = function(evt) {
      xhr.send(evt.target.result);
    };
    reader.readAsBinaryString(file);
  }

  function uploadFileFormData(file) {

    var formData = new FormData();
    formData.append('userFile', file);

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // Handle response.
        console.log(xhr.responseText); // handle response.
      }
    };

    xhr.open("POST", "/upload");
    xhr.send(formData);
  }

  function addDragAndDropEvents() {
    // Setup the dnd listeners.
    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileDrop, false);
  }

  function addSelectFileEvents() {
    document.querySelectorAll('.file-loader').forEach(function (elem) {
      elem.addEventListener('change', handleFileSelect, false);
    });
  }

  function customizeFileSelector() {

    // customize file selector
    var fileSelect = document.getElementById("fileSelect"),
        fileElem = document.getElementById("fileElem");

    fileSelect.addEventListener("click", function (e) {
      e.preventDefault(); // prevent navigation to "#"
      if (fileElem) {
        fileElem.click();
      }
    }, false);
  }

  function addUploadEvents() {
    $('.upload-formdata').click(function (event) {
      var $el = $(this),
          $fileEl = $el.parent().find('[type="file"]'),
          files = $fileEl[0].files;

      $.map(files, uploadFileFormData);
    });
  }

  function testFileReader() {
    $('#test-file-reader').click(function () {
      var file = $(this).siblings('[type=file]')[0].files[0];

      var reader1 = new FileReader(),
          reader2 = new FileReader(),
          reader3 = new FileReader(),
          reader4 = new FileReader();

      reader1.onload = function(evt) {
        console.debug('readAsArrayBuffer():', evt.target.result);
      };
      reader2.onload = function(evt) {
        //console.debug('readAsBinaryString():', evt.target.result);
        console.debug('readAsBinaryString():', evt.target.result.substr(0, 100));
      };
      reader3.onload = function(evt) {
        console.debug('readAsDataURL():', evt.target.result.substr(0, 100));
      };
      reader4.onload = function(evt) {
        console.debug('readAsText', evt.target.result.substr(0, 100));
      };
      reader1.readAsArrayBuffer(file);
      reader2.readAsBinaryString(file);
      reader3.readAsDataURL(file);
      reader4.readAsText(file);
    });

  }


  function main() {
    addSelectFileEvents();
    addDragAndDropEvents();
    customizeFileSelector();
    addUploadEvents();
    testFileReader();
  }

  main();

});
