var firebaseConfig = {
    apiKey: "AIzaSyB1mO4MU0E1gdlz_dmPij_i2VI1rIL2dXQ",
    authDomain: "medismartapp-6cac5.firebaseapp.com",
    databaseURL: "https://medismartapp-6cac5.firebaseio.com",
    projectId: "medismartapp-6cac5",
    storageBucket: "medismartapp-6cac5.appspot.com"

};
firebase.initializeApp(firebaseConfig);



var loginWithGoogle = function () {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
        .then(function () {

            return firebase.auth()
                .signInWithPopup(provider)
                .then(function (result) {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = result.credential.idToken;
                    var uid = result.user.uid;
                    var nombre = result.user.displayName;
                    var celular = result.user.phoneNumber;
                    var foto = result.user.photoURL;
                    var verificado = result.user.emailVerified;
                    var metodoSignIn = result.credential.signInMethod;
                    $.ajax({
                        type: "POST",
                        url: 'LoginExternoFirebase',
                        data: JSON.stringify
                            ({ 'token': token, 'uid': uid, 'nombre': nombre, 'celular': celular, 'foto': foto, 'verificado': verificado, 'metodoSignIn': metodoSignIn }),

                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        async: true,
                        success: function (resultado) {
                            location.href = resultado.returnUrl;
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                        }
                    });
                })
                .catch(err => {
                });
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
}

var loginWithFacebook = function () {
    const provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)
        .then(function () {

            return firebase.auth()
                .signInWithPopup(provider)
                .then(function (result) {
                    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                    var token = result.user.xa;
                    var uid = result.user.uid;
                    var nombre = result.user.displayName;
                    var celular = result.user.phoneNumber;
                    var foto = result.user.photoURL;
                    var verificado = result.user.emailVerified;
                    var metodoSignIn = result.credential.signInMethod;

                    $.ajax({
                        type: "POST",
                        url: 'LoginExternoFacebook',
                        data: JSON.stringify
                            ({ 'token': token, 'uid': uid, 'nombre': nombre, 'celular': celular, 'foto': foto, 'verificado': verificado, 'metodoSignIn': metodoSignIn }),

                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        async: true,
                        success: function (resultado) {
                            location.href = resultado.returnUrl;
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                        }
                    });
                })
                .catch(err => {
                });
        })
        .catch(function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
}