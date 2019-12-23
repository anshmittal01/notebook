// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

define([
    'jquery',
    'base/js/utils',
    'moment', 
    'bidi/bidi',
], function($, utils, moment, bidi) {
    "use strict";

    var isRTL = bidi.isMirroringEnabled();
    var RecentList = function () {
        this.base_url = utils.get_body_data("baseUrl");
    };
    
   RecentList.prototype.load_files=  function (){
        var that = this;
        var settings = {
            processData : false,
            cache : false,
            type : "GET",
            dataType : "json",
            success : $.proxy(that.addFiles, this),
            error : utils.log_ajax_error,
        };
        var url = utils.url_path_join(this.base_url, 'api/recentlist');
        utils.ajax(url, settings);
    };

  RecentList.prototype.addFiles=function (data){
          var that = this;
          document.getElementById("recent_list").innerHTML = "";
          if (data['Error']) {
                document.getElementById("recent_list").innerHTML = '<div class = "row list_placeholder">There are no recent notebooks.</div>';          
 
          }       
          else 
          {
                data.forEach(function(x) {
                var time = utils.format_datetime(x.Time);
                var path = x.Path;
                var item = that.new_item(time,path,moment(x.Time).format("YYYY-MM-DD HH:mm"));
                $('#recent_list').append(item);
          });
        }
        
    };

  RecentList.prototype.new_item = function(time,path,title_time) {
      var row = $('<div/>')
          .addClass("list_item")
          .addClass("row");

      var item = $("<div/>")
          .addClass("col-md-12")
          .appendTo(row);

      $('<i/>')
          .addClass('item_icon')
          .addClass('notebook_icon')
          .addClass('icon-fixed-width')
          .appendTo(item);

      var link = $("<a/>")
          .addClass("item_link")
          .attr("href",path)
          .attr("target","_blank")
          .appendTo(item);

      $("<span/>")
          .addClass("item_name")
          .text(path)
          .appendTo(link);

      var div = $('<div/>')
          .addClass('pull-right')
          .appendTo(item);

      var buttons = $('<div/>')
          .addClass("item_buttons pull-right")
          .appendTo(div);
      $("<button/>")
          .attr('id','remove-nb')
          .addClass("btn btn-warning btn-xs")
          .text('Remove')
          .appendTo(buttons);
      var div2 = $('<div/>')
          .addClass('pull-left')
          .appendTo(div);

      $("<span/>")
          .addClass("item_modified")
          .addClass("pull-left")
          .attr('title',title_time)
          .text(time)
          .appendTo(div2);

      $("<span/>")
          .addClass("file_size")
          .addClass("pull-right")
          .appendTo(div2);

      return row;
  };

  RecentList.prototype.deleteRecentList = function(del_id) {
          var that = this;
          var settings = {
              processData : false,
              cache : false,
              type : "DELETE",
              dataType : "json",
              success : function () {
                  window.location.reload()
              },
              error : utils.log_ajax_error
          };

          var url = utils.url_path_join(
              this.base_url,
              'api/recentlist/',
              del_id
          );
          utils.ajax(url, settings);
        };


    return {'RecentList': RecentList};
});
