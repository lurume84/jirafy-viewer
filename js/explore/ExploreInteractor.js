(function(interactors)
{
    function ExploreInteractor()
    {
        
    }

    Object.defineProperties(ExploreInteractor.prototype,
    {
        getIssue : {
            value: function(key, listener)
            {
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/api/2/issue/" + key + "?fields=subtasks",
                    beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + credentials.token);
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr.responseJSON);
					}
				});
            },
            enumerable: false
        },
        getSubtask : {
            value: function(key, listener)
            {
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/api/2/issue/" + key + "?fields=assignee,status",
                    beforeSend: function(xhr) { 
						xhr.setRequestHeader("Authorization", "Basic " + credentials.token);
					},
					success: function (json)
					{
						listener.onSuccess(json);
					},
					error: function (jqxhr, textStatus, error)
					{
						listener.onError(jqxhr.responseJSON);
					}
				});
            },
            enumerable: false
        }
    });

    interactors.ExploreInteractor = ExploreInteractor;
})(viewer.interactors);