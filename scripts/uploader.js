var $fileInput = $('#uploadFile');
var $droparea = $('.file-drop-area');
var chunkLoaded = 0;
var BYTES_PER_CHUNK = 0;
var totalLoaded = 0;
var x = 1;
var upFilesCount = 0;

$(document).ready(function () {
  // Enables tooltip for all elements that have tooltip.
  $('[data-toggle="tooltip"]').tooltip();

  $('#applyTags').click(function (e) {
    e.preventDefault();
    var enabledFiles = $('.input_fields_wrapper .item.selected');
    var Tags = $('input.global-tags').val();
    if (Tags.length != "") {
      $(enabledFiles).each(function () {
        if ($(this).hasClass('uploaded')) {
          $(this).addClass('ready');
        }
        $(this).find('input').val(Tags);
      });
    }
    filesReady();
  });

  $('#btnUpload').click(function (e) {
    e.preventDefault();
    var filesNumber = $('#uploadFile')[0].files;
    var keywords_fields = $('.input_fields_wrapper .item.pending');
    $(keywords_fields).each(function () {
      var file_name = $(this).find('.keywords').attr('data-file');
      var Tags = $(this).find('.keywords').val();
      if (Tags != '') {
        $(this).removeClass('error');
        var keywords = Tags.split(',');
        UpdateFile(file_name, keywords);
      }
      else {
        $(this).addClass('error');
        $(this).find('span.required').remove();
        $(this).append('<span class="required">Please enter at least one tag.</span>');
      }
    });
  });

  $('.input_fields_wrapper').on("click", ".remove_field", function (e) {
    //user click on remove text
    e.preventDefault();
    $(this).parent('div').remove();
    x--;
    if (x === 1) {
      $fileInput.val('');
    }
  });
});

function unselectFiles() {
  $('.keywords').unbind('blur');

  $('.keywords').on('blur', function () {
    var Tags = $(this).val();
    if (Tags != '') {
      $(this).parent().removeClass('error');
      $(this).parent().addClass('ready');
      $(this).parent().find('span.required').remove();
    }
    else {
      $(this).parent().removeClass('ready');
    }
    filesReady();
  });
}
// Changes selected file.
function selectFiles() {
  $('.select-file').unbind('click');

  $('.select-file').on('click', function (e) {
    var checkbox = this;
    var fileContainer = $(this).closest('.item');
    var selectedFilesQty = $('.input_fields_wrapper').find('input:checked').length;
    var tagsInput = $(this).closest('#applyTags');

    $(fileContainer).toggleClass('selected');

    if (selectedFilesQty !== 0) {
      $(tagsInput).addClass('enabled');
    } else {
      $(tagsInput).removeClass('enabled');
    }
  });

  filesReady();
}

// Highlights drag area.
$fileInput.on('dragenter focus click', function () {
  $droparea.addClass('is-active');
});

// Back to normal state.
$fileInput.on('dragleave blur drop', function () {
  $droparea.removeClass('is-active');
});

// Changes inner text.
$fileInput.on('change', function () {
  var filesNumber = $('#uploadFile')[0].files;
  var filesCount = $(this)[0].files.length;
  var $textContainer = $(this).prev();

  if (filesCount > 0) {

    $('.global-tags-wrapper').addClass('visible');
  }

  if (filesCount === 1) {
    // if single file is selected, show file name.
    var fileName = $(this).val().split('\\').pop();
    $textContainer.text(fileName);
  } else {
    // Otherwise show number of files.
    $textContainer.text(filesCount + ' files selected');
  }

  var wrapper = $(".input_fields_wrapper"); //Fields wrapper
  wrapper.empty();

  $(filesNumber).each(function () {
    $(wrapper).append('<div class="item pending"><a href="#" class="remove_field">Remove</a><div class="file-label">File: </div><div class="file">' + this.name +
      '</div><div class="tags-label">Tags: </div><input placeholder="Separate tags with a comma (Tag1, Tag2,...)" ' +
      'class="keywords" type="text" name="keywords" success-part="0" total-parts="0" data-file="' + this.name +
      '" required/><div class="progress-status"><div></div></div><div class="select-wrapper"><span>Select File: </span><input class="select-file" type="checkbox"/></div></div>');
    x++;
    UploadFile(this);

  });
  selectFiles();
  unselectFiles();
});
function UploadFile(TargetFile) {
  // create array to store the buffer chunks
  var FileChunk = [];
  // the file object itself that we will work with
  var file = TargetFile;
  // set up other initial vars
  var MaxFileSizeMB = 4;
  var BufferChunkSize = MaxFileSizeMB * (1024 * 1024);
  BYTES_PER_CHUNK = BufferChunkSize;
  var ReadBuffer_Size = 1024;
  var FileStreamPos = 0;
  // set the initial chunk length
  var EndPos = BufferChunkSize;
  var Size = file.size;

  // Increate the global var when file is uploading.
  upFilesCount++;

  // add to the FileChunk array until we get to the end of the file
  while (FileStreamPos < Size) {
    // "slice" the file from the starting position/offset, to  the required length
    FileChunk.push(file.slice(FileStreamPos, EndPos));
    FileStreamPos = EndPos; // jump by the amount read
    EndPos = FileStreamPos + BufferChunkSize; // set next chunk length
  }
  // get total number of "files" we will be sending
  var TotalParts = FileChunk.length;
  var PartCount = 0;
  // loop through, pulling the first item from the array each time and sending it
  while (chunk = FileChunk.shift()) {
    PartCount++;
    // file name convention
    var FilePartName = file.name + ".part_" + PartCount + "." + TotalParts;
    // send the file
    addStatus(file.name, TotalParts);
    UploadFileChunk(chunk, FilePartName, file.name);
  }
}

function UploadFileChunk(Chunk, FilePartName, originalName) {
  var FD = new FormData();
  var Tags = [
    "tag1", "tag2", "tag3"
  ];
  var percentComplete = 0;
  FD.append('data', Chunk, FilePartName);
  FD.append('Tags', Tags);
  FD.append('OriginalName', originalName);
  $.ajax({
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      //Upload progress
      xhr.upload.addEventListener("progress", progressHandler, false);
      xhr.addEventListener("load", completeHandler, false);
      return xhr;
    },
    type: "POST",
    url: "/umbraco/Surface/Home/UploadFile",
    contentType: false,
    processData: false,
    data: FD,
    success: function (data) {
      updateStatus(data.file);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
    }
  });
}

function progressHandler(event) {
  $("#loadedtotal").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
  var percent = (event.loaded / event.total) * 100;
  $("#progressBar").value = Math.round(percent);
  $("#status").innerHTML = Math.round(percent) + "% uploaded... please wait";
}

function completeHandler(event) {
  $("#status").innerHTML = event.target.responseText;
  $("#progressBar").value = 0;
}

function UpdateFile(file_name, Tags) {
  var FD = new FormData();
  // Checks if name input has value.

  var json_array = JSON.stringify(Tags);
  FD.append('Tags', Tags);
  FD.append('Name', file_name);

  $.ajax({
    type: "POST",
    url: "/umbraco/Surface/Update/UpdateFile",
    contentType: false,
    processData: false,
    data: FD,
    success: function (data) {
      createdFiles(data.file);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
    }
  });
}

function addStatus(File, totalParts) {
  totalParts = parseInt(totalParts, 10);
  $('.input_fields_wrapper .item').find("input[data-file='" + File + "']").attr("total-parts", totalParts);
}

function updateStatus(File) {
  var successPart = parseInt($('.input_fields_wrapper .item').find("input[data-file='" + File + "']").attr("success-part"), 10);
  var totalParts = parseInt($('.input_fields_wrapper .item').find("input[data-file='" + File + "']").attr("total-parts"), 10);
  successPart++;
  var percentage = Math.round((successPart / totalParts) * 100);
  var input_field = $('.input_fields_wrapper .item').find("input[data-file='" + File + "']").attr("success-part", successPart);
  var progress_div = $(input_field).parent().find('.progress-status');
  progress(percentage, progress_div);

  if (successPart == totalParts) {
    input_field = $('.input_fields_wrapper .item').find("input[data-file='" + File + "']");
    $(input_field).parent().addClass('uploaded');
    if ($(input_field).length && $(input_field).val().length) {
      $(input_field).parent().addClass('ready');
      filesReady();
    }
  }
}

function progress(percent, $element) {
  var progressBarWidth = percent * $element.width() / 100;
  $element.find('div').animate(
    { width: progressBarWidth },
    0,
    'swing',
    function () {
      // When file starts to upload.
      if (percent == 1) {
        acDeActUploadBtn();
      }

      // When file finishes to upload.
      if (percent == 100) {
        upFilesCount--;
        acDeActUploadBtn();
      }

      // Prevent percent value go over 100.
      if (percent > 100) {
        percent = 100;
      }
    }).html(percent + "% ");
}

// Check if upload button must be disabled.
function acDeActUploadBtn() {
  var btn = $('#btnUpload');

  // Verify if there are files uploading.
  if (upFilesCount == 0) {
    $(btn).attr('disabled', false);
  } else {
    $(btn).attr('disabled', true);
  }
}

function createdFiles(File) {
  $('.input_fields_wrapper .item').find("input[data-file='" + File + "']").parent().removeClass('pending').addClass("done").append("<div class='done'>Done</div>");
  $('.input_fields_wrapper .item').find("input[data-file='" + File + "']").parent().removeClass('ready');
  filesReady();
}

function filesReady() {
  var files_ready = $('.input_fields_wrapper .item.ready').length;
  var title = "There are not files ready to upload.";
  if (files_ready > 0) {
    title = "There are " + files_ready + " files to upload.";
    $('#btnUpload').addClass('enabled');
  }
  else {
    $('#btnUpload').removeClass('enabled');
  }
  $('#btnUpload').attr("data-original-title", title);
}