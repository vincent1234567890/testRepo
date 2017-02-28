/**
 * Created by eugeneseah on 5/1/17.
 */

const ProfileManager = (function () {
    let _profile;

    function ProfileManager() {

    }

    const proto = ProfileManager.prototype;
    proto.displayView= function(parent, data){
        if(!_profile) {
            _profile = new ProfileView();
        }else{
            _profile.showView()
        }
    };

    return ProfileManager;
}());