(function(interactors)
{
    function BoardInteractor()
    {
        
    }

    Object.defineProperties(BoardInteractor.prototype,
    {
        getIssueTypes : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/api/2/issuetype",
                    beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + credentials.token);
                        $.xhrPool.push(xhr);
					},
					success: function (json)
					{
                        var issuetypes = [];
                        
						$.each(json, function()
                        {
                            if(!this.subtask)
                            {
                                issuetypes.push(this.id);
                            }
                        });
                        
                        listener.onSuccess(issuetypes);
					},
					error: function (jqxhr, textStatus, error)
					{
						if(textStatus != "abort")
                        {
                            listener.onError(jqxhr.responseJSON);
                        }
					}
				});
            },
            enumerable: false
        },
        getBoards : {
            value: function(listener)
            {
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/agile/1.0/board",
                    beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + credentials.token);
                        $.xhrPool.push(xhr);
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
                        if(textStatus != "abort")
                        {
                            listener.onError(jqxhr.responseJSON);
                        }
					}
				});
            },
            enumerable: false
        },
        getSprint : {
            value: function(board, listener)
            {
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/agile/1.0/board/" + board + "/sprint?maxResults=1000&state=active",
                    beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + credentials.token);
                        $.xhrPool.push(xhr);
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						if(textStatus != "abort")
                        {
                            listener.onError(jqxhr.responseJSON);
                        }
					}
				});
            },
            enumerable: false
        },
        getIssues : {
            value: function(board, sprint, issuetypes, listener)
            {
                var jql = "issuetype in (" + issuetypes.toString() + ")";
                
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/agile/1.0/board/" + board + "/sprint/" + sprint + "/issue?maxResults=1000&fields=summary,issuetype,parent&jql=" + jql,
                    beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + credentials.token);
                        $.xhrPool.push(xhr);
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						if(textStatus != "abort")
                        {
                            listener.onError(jqxhr.responseJSON);
                        }
					}
				});
            },
            enumerable: false
        }
    });

    interactors.BoardInteractor = BoardInteractor;
})(viewer.interactors);