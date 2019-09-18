(function(views)
{
    var self;

    function CommitView(presenter)
    {
        this.presenter = presenter;
    }

    Object.defineProperties(CommitView.prototype,
    {
        init : {
            value: function()
            {
                var self = this;

                $(document).on("commit", function (evt, data)
                {             
                    self.data = data;
                    self.index = 0;
                    
                    $(".modal-dialog").load("js/commit/template.html", function()
                    {
                        self.template = $(this).find(".commit-task").detach();
                        
                        self.dialog = $(this).find(".commit-dialog");
                        
                        self.dialog.find(".mdl-button.close").click(function()
                        {
                            self.dialog[0].close();
                        });
                        
                        self.dialog.find(".mdl-button.confirm").click(function()
                        {
                            self.commit();
                        });
                        
                        self.next();
                        
                        self.dialog[0].showModal();
                    });
                });
            },
            enumerable: false
        },
        onIssue : {
            value: function(element, data)
            {
                if(data.fields.assignee != undefined)
                {
                    $("<img/>", {src: data.fields.assignee.avatarUrls["48x48"]}).appendTo(element.find(".header .image").html(""));
                }
                else
                {
                    element.find(".header .image").remove();
                }
                element.find(".header .info .sub-name").html(data.fields.summary);
            },
            enumerable: false
        },
        onTransitions : {
            value: function(element, data)
            {
                $.each(data.transitions, function(index)
                {
                    var transition = $("<div/>", {class: "radio", html: 
                    "    <label class=\"transitionRadio mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"transition-" + (index + 1) + "\">" +
                    "      <input type=\"radio\" id=\"transition-" + (index + 1) + "\" class=\"mdl-radio__button\" name=\"transition\" value=\"" + this.id + "\">" +
                    "      <span class=\"mdl-radio__label\">" + this.name + "</span>" +
                    "    </label>" +
                    "</div>"});
                    
                    transition.appendTo(element.find(".info3 > .radios"));
                    
                    $.each(this.fields, function(key)
                    {
                        if(this.schema.type == "string")
                        {
                            var field = "<textarea name=\"" + key + "\" class=\"fieldTransition transition-" + (index + 1) + " hidden\" placeholder=\"" + this.name + "\"></textarea>";
                            element.find(".info3 > .fields").append(field);
                        }
                        else if(this.schema.type == "resolution")
                        {
                            var options = "";
                            
                            $.each(this.allowedValues, function()
                            {
                                options += "<option value=\"" + this.id + "\">" + this.name + "</option>";
                            });

                            var field = $("<select/>", {class: "fieldTransition transition-" + (index + 1) + " hidden", html: options, name: this.name});
                            element.find(".info3 > .fields").append(field);
                        }
                    });
                });
                
                element.find(".transitionRadio input").change(function()
                {
                    element.find(".fieldTransition").addClass("hidden");
                    element.find("." + this.id).removeClass("hidden");
                })
                
                componentHandler.upgradeAllRegistered();
            },
            enumerable: false
        },
        next : {
            value: function()
            {
                var elements = Object.keys(this.data);
                
                if(elements.length > this.index)
                {
                    var key = Object.keys(this.data)[this.index]
                    
                    var seconds = this.data[key].seconds;
                    var clone = this.template.clone();
                    
                    clone.find(".header .info .name").html(key);
                    
                    var time = secondsToHHMMSS(seconds);
                    
                    clone.find("#commit-hourspent").val(time.hours);
                    clone.find("#commit-minutespent").val(time.minutes);
                    clone.find("#commit-secondspent").val(time.seconds);
                    
                    clone.appendTo($(".commit-dialog .mdl-dialog__content").html(""));
                    
                    clone.find("input[name=adjustEstimate]").change(function()
                    {
                        clone.find("input[name=newEstimate]").prop("disabled", this.value != "new");
                        clone.find("input[name=adjustmentAmount]").prop("disabled", this.value != "manual");
                    });
                    
                    componentHandler.upgradeAllRegistered();
                    
                    $(".commit-dialog .header .commit-progress")[0].MaterialProgress.setProgress(((this.index + 1) / elements.length) * 100);
                    
                    this.presenter.getIssue(clone, key);
                    this.presenter.getTransitions(clone, key);
                }
                else
                {
                    this.dialog[0].close();
                }
            },
            enumerable: false
        },
        commit : {
            value: function()
            {
                var element = $(".commit-dialog .mdl-dialog__content");
                
                var key = Object.keys(this.data)[this.index]
                    
                var started = this.data[key].started;
                var seconds = this.data[key].seconds;
                
                var adjust = element.find("input[name=adjustEstimate]:checked").val();
                
                query = "?adjustEstimate=" + adjust;
                
                switch(adjust)
                {
                    case "new": 
                        query += "&newEstimate=" + element.find("input[name=newEstimate]").val();
                        break;
                    case "manual": 
                        query += "&reduceBy=" + element.find("input[name=adjustmentAmount]").val();
                        break;
                }
                
                var content = {};
                
                content.comment = element.find("textarea[name=description]").val();

                var hours = Number.parseInt(element.find("#commit-hourspent").val());
                var minutes = Number.parseInt(element.find("#commit-minutespent").val());
                var seconds = Number.parseInt(element.find("#commit-secondspent").val());

                content.timeSpent = "";

                if(hours != undefined)
                {
                    content.timeSpent += hours + "h";
                }
                
                if(minutes != undefined)
                {
                    if(seconds != undefined && seconds > 0)
                    {
                        minutes++;
                    }
                    
                    if(content.timeSpent != "") content.timeSpent += " ";
                    content.timeSpent += minutes + "m";
                }
                else
                {
                    if(seconds != undefined && seconds > 0)
                    {
                        if(content.timeSpent != "") content.timeSpent += " ";
                        content.timeSpent += "1m";
                    }
                }
                
                content.started = started;
                
                this.presenter.addWorklog(key, content, query);
                
                var transition = element.find("input[name=transition]:checked");
                
                if(transition != undefined && transition.val() != "none")
                {
                    var fields = {};
                    
                    $.each(element.find(".fieldTransition." + transition.attr("id")), function(key)
                    {
                        fields[this.name] = this.value;
                    });
                    
                    this.presenter.transit(key, transition.val(), fields);
                }
            },
            enumerable: false
        },
        onAddWorklog : {
            value: function(data)
            {
                var key = Object.keys(this.data)[this.index];
                this.presenter.removeUncommitted(key);
            },
            enumerable: false
        },
        onRemoveUncommitted : {
            value: function(data)
            {
                this.index++;
                this.next();
                
                var uncommitted = $(".left-panel-inner .content .main-menu .menu-item:first-child");
                
                if(uncommitted.hasClass("active"))
                {
                    uncommitted.trigger("click");
                }
            },
            enumerable: false
        },
        onTransit : {
            value: function(data)
            {
                
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

    views.CommitView = CommitView;
})(viewer.views);