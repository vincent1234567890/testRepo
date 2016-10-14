var dg = new PAYPAL.apps.DGFlow({
    trigger: "submitBtn",
    expType: 'instant'
});

function loadPayments() {
    google.load('payments', '1.0', {
        'packages':['Production_config']/*,
        'callback':function () {
            console.log("Payments module loaded!")
        }*/
    });
}

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-36188861-1']);
_gaq.push(['_trackPageview']);
(function () {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';

    var jsapi = document.createElement('script');
    jsapi.type = 'text/javascript';
    jsapi.src = 'https://www.google.com/jsapi?callback=loadPayments';

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
    s.parentNode.insertBefore(jsapi, s);
})();

/*
 var GoogleAdTagUrl = "http://ad.doubleclick.net/pfadx/AngelaSite;kw=html5linearnonlinear;sz=300x300;ord=5036130;dcmt=text/xml";
 var GoogleAdType = 'overlay';
 var adSlotWidth = 300;
 var adSlotHeight = 250;

 GoogleAd = function () {
 google.setOnLoadCallback(onSdkLoaded);
 google.load("ima", "1");
 var adsManager;

 function onSdkLoaded() {
 var adsLoader = new google.ima.AdsLoader();

 // Add event listeners
 adsLoader.addEventListener(
 google.ima.AdsLoadedEvent.Type.ADS_LOADED,
 onAdsLoaded,
 false);
 adsLoader.addEventListener(
 google.ima.AdErrorEvent.Type.AD_ERROR,
 onAdError,
 false);

 var adsRequest = {
 adTagUrl:GoogleAdTagUrl,
 adType:GoogleAdType
 };

 // Make request
 adsLoader.requestAds(adsRequest);

 function onAdsLoaded(adsLoadedEvent) {
 // Get the overlay ads manager.
 adsManager = adsLoadedEvent.getAdsManager();
 adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);

 // Get the first ad from the Ads Manager.
 var ad = adsManager.getAds()[0];
 // Get a list of companion ads for an ad slot size and CompanionAdSelectionSettings
 var companionAds = ad.getCompanionAds(adSlotWidth,
 adSlotHeight,
 {resourceType:google.ima.CompanionAdSelectionSettings.ResourceType.STATIC,
 creativeType:google.ima.CompanionAdSelectionSettings.CreativeType.IMAGE});

 var companionAd = companionAds[0];
 // Get HTML content from the companion ad.
 var content = companionAd.getContent();
 // Write the content to the companion ad slot.
 var div = document.getElementById('companion-ad-300-250');
 div.innerHTML = content;

 }

 function onAdError() {
 console.log("err")
 }
 }
 }();*/
