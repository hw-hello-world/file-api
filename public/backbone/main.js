var UploadModel = Backbone.Model.extend({

  initialize: function (attrs, options) {
    this.url = options.url;
  }

});

var ImgUploadModel = UploadModel.extend({
  // {"imageUrl":"/bc/fileStoreRecord?id=fs0oc9yFFETO9HlES0g3","imageId":"fs0oc9yFFETO9HlES0g3"}
  defaults: {
    imageUrl: '',
    imageId: ''
  }
});

var UploadView = Backbone.View.extend({

  attributes: {
    class: 'file-uploader'
  },

  template: _.template('<label>Customize file selector: </label>' +
                       '<a class="select-file">Select image file</a>' +
                       '<input class="file-loader" type="file" name="file" style="display: none;"/>' +
                       '<p class="file-info"></p>'+
                       '<p class="preview"></p>'
                      ),

  events: {
    'click .select-file': 'selectFile',
    'change .file-loader': 'onFileSelected'
  },

  endpoint: '/upload',

  fileFieldName: 'userFile',

  initialize: function () {
    this.model = new UploadModel({}, {url: this.endpoint});

    _.bindAll(this, 'previewFileContent', 'handleUploadError');
  },

  selectFile: function (e) {
    e.preventDefault();
    this.$('.file-loader').click();
  },

  onFileSelected: function (e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.target.files;

    if (!files) {
      console.warn('File API is not supported');
      return;
    }

    this.showFileInfo(files[0]);
    this.doUploadFile(files[0])
      .done(this.previewFileContent)
      .fail(this.handleUploadError);
  },

  showFileInfo: function (file) {
    var tpl = _.template('<ul>' +
                         '<li>File name: <%= fileName %></li>' +
                         '<li>File size: <%= fileSizeKB %>KB (<%= fileSize %>) </li>' +
                         '</ul>'
                        );

    this.$('.file-info').html(tpl({ fileName: file.name,
                                    fileSizeKB: Math.ceil(file.size / 1000),
                                    fileSize: file.size,
                                    fileType: file.type
                                  }));
  },

  doUploadFile: function (file) {
    var self = this,
        formData = new FormData();

    formData.append(this.fileFieldName, file);

    var options = { data: formData,
                    xhr: function(){
                      var xhr = $.ajaxSettings.xhr() ;
                      xhr.upload.addEventListener("progress", self.onProgress, false);
                      xhr.upload.addEventListener("load", self.onComplete, false);
                      return xhr ;
                    },
                    // TODO: why disable those settings
                    processData: false,
                    contentType: false
                  };

    return this.model.save({}, options);
  },

  onProgress: function (e) {
    if (e.lengthComputable) {
      var percentage = Math.round((e.loaded * 100) / e.total);
      console.debug('upload to server in progress', percentage);
    }
  },

  onComplete: function () {
    console.debug('percentage 100%');
  },

  // TODO: extend this function to handle various file types.
  previewFileContent: function (resp) {

    var previewTpl = _.template('<img src="/<%= imageUrl %>" />');

    console.info('upload succeed', this.model.toJSON());

    this.$('.preview').html(previewTpl(this.model.toJSON()));
  },

  handleUploadError: function (xhr, status, error) {
    console.error('upload error:', error);
  },

  render: function () {
    this.$el.html(this.template());
  }

});

$(function () {

  var view = new UploadView();
  view.render();

  $('#main-container').html(view.$el);
});
