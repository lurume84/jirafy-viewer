(function(interactors)
{
    function UserInteractor()
    {
        
    }

    Object.defineProperties(UserInteractor.prototype,
    {
        getUser : {
            value: function(userName, listener)
            {
				$.ajax
				({
					type: "GET",
                    dataType: 'json',
                    contentType: 'application/json',
					url: credentials.server + "/rest/api/latest/user?username=" + userName,
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

    interactors.UserInteractor = UserInteractor;
})(viewer.interactors);