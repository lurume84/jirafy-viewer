(function(interactors)
{
    function BoardInteractor()
    {
        
    }

    Object.defineProperties(BoardInteractor.prototype,
    {
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
            value: function(board, sprint, listener)
            {
                 var jql = "";
                $.each(Object.entries(g_issuetype_map.user_story), function()
                {
                    if(jql !="")
                    {
                        jql += " OR ";
                    }
                    
                    jql += "issuetype = " + this[0];
                });
                
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/agile/1.0/board/" + board + "/sprint/" + sprint + "/issue?maxResults=1000&fields=summary,issuetype&jql=" + jql,
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