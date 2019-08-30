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

                $(".playlists-list").on("loaded", function (evt, data)
                {             
                    self.issues = data.issues;
                    
                    $(".playlists-list > div").click(function()
                    {
                        self.presenter.getSettings($(this).index());
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
                    self.template = $(this);
                    
                    self.template.find(".playlist-image img").attr("src", data.fields.project.avatarUrls["48x48"]);
                    self.template.find(".playlist-name").html(data.key);
                    self.template.find(".info-container:first-child .value").html(data.fields.summary);
                    
                    var time = secondsToHHMMSS(data.fields.aggregatetimeoriginalestimate);
                    
                    self.template.find(".info-container:nth-child(2) .value").html(time.hours + ":" + time.minutes + "h");
                    
                    self.row = self.template.find(".album-table .flex-table-row:nth-child(2)").detach();
                    
                    self.presenter.getIssues(data.key);
                });
            },
            enumerable: false
        },
        onIssues : {
            value: function(data)
            {
                var self = this;
                
                this.template.find(".info-container:nth-child(2) .value").append(" / " + data.issues.length + " tasks");
                    
                if(data.issues.length == 0)
                {
                    this.template.find(".no-tracks").removeClass("hidden");
                }
                
                $.each(data.issues, function()
                {
                    self.onIssue(this);
                });
            },
            enumerable: false
        },
        onIssue : {
            value: function(data)
            {
                var clone = this.row.clone();
                
                clone.find(".pause-icon").hide();
                clone.find(".playing-icon-container").hide();
                clone.find(".remove-track").hide();
                clone.find(".track-added").hide();
                clone.find(".track-name .ellipses").html(data.key);
                clone.find(".artist-name .artists").html(data.fields.summary);
                $("<img/>", {src: data.fields.issuetype.iconUrl}).appendTo(clone.find(".add-remove-track"));
                
                if(this.settings.status.closed.find(function(x){return x == data.fields.status.id;}) != undefined)
                {
                    $("<i/>", {class: "icon icon-ok"}).appendTo(clone.find(".popularity"));
                    clone.addClass("complete");
                }
                
                clone.appendTo($(".album-table"));
                
                clone.find(".track-index").html(clone.index());
                
                clone.dblclick(function() 
                {
                    $(document).trigger("play", data.key);
                });
                
                clone.contextmenu(function(evt) 
                {
                    $(document).trigger("context-menu", {key: data.key, pos: {left:evt.pageX,top:evt.pageY}});
                    evt.preventDefault();
                });
                
                if(data.fields.assignee != undefined)
                {
                    clone.find(".album-name .ellipses").html(data.fields.assignee.displayName);
                }
                
                if(data.fields.timetracking.originalEstimateSeconds != undefined)
                {                
                    var time = secondsToHHMMSS(data.fields.timetracking.originalEstimateSeconds); 
                    clone.find(".track-duration").html(time.hours + ":" + time.minutes);
                }
                else
                {
                    clone.find(".track-duration").html("-:-");
                }
                
                if(this.settings.status.closed.find(function(x){return x == data.fields.status.id;}) == undefined)
                { 
                    $("<div/>", {class: "popularity-widget", html: "<div class=\"popularity-fill\" style=\"width: " + data.fields.progress.percent + "%\"></div>"}).appendTo(clone.find(".popularity"));
                }
            },
            enumerable: false
        },
        onLoadSettings : {
            value: function(index, data)
            {
                this.settings = data;
                this.presenter.load(this.issues[index].key);
            },
            enumerable: false
        },
        showError : {
            value: function(data)
            {
                showError(data);
            },
            enumerable: false
        }
    });

    views.UserStoryView = UserStoryView;
})(viewer.views);