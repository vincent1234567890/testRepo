/**
 * Created by eugeneseah on 5/1/17.
 */

const ProfileManager = (function () {
    let _profile;
    function ProfileManager() {

    }

    const proto = ProfileManager.prototype;
    proto.doView= function(parent, data){
        _profile = new ProfileView();
    };

    return ProfileManager;
}());