var firebaseConfig = {
    apiKey: "AIzaSyAnmGqJ-FIOOjJZtCCbK1GpnMPwcmTHOtU",
    authDomain: "medismartclini.firebaseapp.com",
    projectId: "medismartclini",
    storageBucket: "medismartclini.appspot.com",
    messagingSenderId: "225894797333",
    appId: "1:225894797333:web:24a1adfb1a6732cde9be1c"
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