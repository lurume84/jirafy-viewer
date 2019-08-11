(function(views)
{
    var self;

    function UserStoryView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(UserStoryView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $(".playlists-list").on("loaded", function ()
                {             
                    $(".playlists-list > div").click(function()
                    {
                        self.presenter.load($(this).attr("us-id"))
                    });
                });
            },
            enumerable: false
        },
        load : {
            value: function(data)
            {
                var self = this;

                $(".main-view").load("js/user_story/template.html", function()
                {
                    $(this).find(".playlist-image img").attr("src", data.fields.project.avatarUrls["48x48"]);
                    $(this).find(".playlist-name").html(data.key);
                    $(this).find(".info-container:first-child .value").html(data.fields.summary);
                    $(this).find(".info-container:nth-child(2) .value").html(data.fields.subtasks.length + " tasks / " + moment.utc(data.fields.aggregatetimeoriginalestimate*1000).format('HH:mm') + "h");
                    
                    data.fields.subtasks.length > 0 ? $(this).find(".no-tracks").hide() : $(this).find(".no-tracks").show();
                    
                    var row = $(this).find(".album-table .flex-table-row:nth-child(2)").detach();
                    
                    $.each(data.fields.subtasks, function(index)
                    {
                        var clone = row.clone();
                        var task = $(this)[0];
                        
                        clone.find(".track-index").html(index + 1);
                        
                        clone.find(".pause-icon").hide();
                        clone.find(".playing-icon-container").hide();
                        clone.find(".remove-track").hide();
                        clone.find(".track-added").hide();
                        clone.find(".track-name .ellipses").html(task.key);
                        clone.find(".artist-name .artists").html(task.fields.summary);
                        $("<img/>", {src: task.fields.issuetype.iconUrl}).appendTo(clone.find(".add-remove-track"));
                        
                        if(g_status_map.closed[task.fields.status.id] != undefined)
                        {
                            $("<i/>", {class: "icon icon-ok"}).appendTo(clone.find(".popularity"));
                            clone.addClass("complete");
                        }
                        
                        clone.appendTo($(".album-table"));
                        
                        clone.dblclick(function() 
                        {
                            $(document).trigger("play", task.key);
                        });
                        
                        self.presenter.getIssue(clone, task.key);
                    });
                    
                    var ps = new PerfectScrollbar($(".playlist-page")[0], { suppressScrollX: true });
                });
            },
            enumerable: false
        },
        onIssue : {
            value: function(element, data)
            {
                if(data.fields.assignee != undefined)
                {
                    element.find(".album-name .ellipses").html(data.fields.assignee.displayName);
                }
                
                element.find(".track-duration").html(moment.utc(data.fields.aggregatetimeoriginalestimate*1000).format('HH:mm'));
                
                if(g_status_map.closed[data.fields.status.id] == undefined)
                { 
                    $("<div/>", {class: "popularity-widget", html: "<div class=\"popularity-fill\" style=\"width: " + data.fields.aggregateprogress.percent + "%\"></div>"}).appendTo(element.find(".popularity"));
                }
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                document.querySelector('#toast').MaterialSnackbar.showSnackbar({message: data.message});
            },
            enumerable: false
        }
    });

    views.UserStoryView = UserStoryView;
})(viewer.views);