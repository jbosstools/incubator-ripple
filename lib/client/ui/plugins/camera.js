/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
 */

var ui = ripple('ui'),
    event = ripple('event'),
    upload = document.getElementById('file-upload'),
    take = document.getElementById('take-file'),
    optOut = document.getElementById('camera-cancel'),
    result = document.getElementById('camera-result'),
    uploadButton = document.getElementById('upload-file-button');

function getType() {
    return (upload.getAttribute('accept') || "").replace("/*", "");
}

function clear() {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

module.exports = {
    initialize: function() {
        $("#camera-window").dialog({
            autoOpen: false,
            modal: true,
            title: "Take Photo",
            heigh: 50,
            width: 400,
            position: 'center',
        }).hide();

        var wrapper = $('<div/>').css({
            height: 0,
            width: 0,
            'overflow': 'hidden'
        }); //XXX adding wrapper for hiding <input type="file"/> (#file-upload)
        var fileInput = $(upload).wrap(wrapper);
        $(uploadButton).click(function() {
            upload.click();
        }).show();

        upload.addEventListener('change', function() {
            var imageLink;
            var iframe = $('<iframe name="postiframe" id="postiframe" style="display: none" />'); //XXX adding iframe in order to get callback from UploadFileServlet (standart workaround)
            $("body").append(iframe);

            var form = $('#photo-form');

            form.attr("action", "ripple/fileUpload");
            form.attr("method", "post");
            form.attr("enctype", "multipart/form-data");
            form.attr("encoding", "multipart/form-data");
            form.attr("target", "postiframe");
            form.attr("photo", $('#file-upload').val());

            form.submit();
            $("#postiframe").load(function() {
                var iframeContents = $("#postiframe")[0].contentWindow.document.body.innerHTML;
                $("#textarea").html(iframeContents);
                var response = $("#textarea").text();
                var imageLink = JSON.parse(response).photoUrl;
                clear();
                var capture = document.createElement(getType());
                capture.style.height = "272px";
                capture.style.display = "block";
                capture.src = imageLink;
                result.appendChild(capture);
                take.style.display = "inline";
            });
            return false;
        });

        take.addEventListener('click', function() {
            //console.log("type", getType());
            event.trigger('captured-' + getType(), [result.firstChild.src, upload.files[0]]);
            $("#camera-window").dialog("close");
        });

        optOut.addEventListener('click', function() {
            console.log('capture-image cancelled');
            event.trigger('image-capture-cancelled');
            $("#camera-window").dialog("close");
        });
    },
    show: function(type) {
        type = type || "image";
        $("#camera-window").dialog("open");

        if (getType() !== type) {
            clear();
        }
        upload.setAttribute("accept", type + "/*");

        if (result.firstChild && result.firstChild.src) {
            take.style.display = "inline";
        } else {
            take.style.display = "none";
        }
        event.trigger('camera-opened');
    },
    hide: function() {
        if (result.firstChild && result.firstChild.pause) {
            result.firstChild.pause();
        }
        ui.hideOverlay("camera-window");
        event.trigger('camera-closed');
    }
};
