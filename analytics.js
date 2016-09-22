exports.applyAnalytics=function()
{
	var analytics = navigator.analytics;

// set the tracking id
analytics.setTrackingId('UA-84675105-1');

analytics.sendAppView('home', successCallback, errorCallback);

// or the same could be done using the send function

var Fields    = analytics.Fields,
    HitTypes  = analytics.HitTypes,
    LogLevel  = analytics.LogLevel,
    params    = {};

params[Fields.HIT_TYPE]     = HitTypes.APP_VIEW;
params[Fields.SCREEN_NAME]  = 'home';

analytics.setLogLevel(LogLevel.INFO);

analytics.send(params, successCallback, errorCallback);
}

