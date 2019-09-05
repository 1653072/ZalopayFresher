import { api } from "../api/api";
import {setJwtToStorage,clearStorage} from "../utils/storageUtil";


export const INIT_USER = "user.GET_INFO_FOR_MESS";
export const REGISTER_SUCCEEDED = "user.REGISTER_SUCCEEDED";
export const REGISTER_FAILED = "user.REGISTER_FAILED";
export const LOGIN = "user.LOGIN";
export const UPDATE_PASSWORD = "user.UPDATE_PASSWORD";
export const UPDATE_AVATAR = "user.UPDATE_AVATAR";
export const UPDATE_DISPLAYEDNAME = "user.UPDATE_DISPLAYEDNAME";
export const UPDATE_EMAIL = 'user.UPDATE_EMAIL'
export const LOGOUT = "user.LOGOUT";
export const LOAD_USERINFO = "user.LOAD_USERINFO";
export const RESET_PASSWORD = "user.LOAD_USERINFO";
export const PRE_RESET_PASSWORD = "user.LOAD_USERINFO";
export const FORGOT_PASSWORD = "user.LOAD_USERINFO";


//type: response
export function initUser() {
  return {
    type: INIT_USER
  };
}

export function logout(history) {
  return function(dispatch) {
    api
      .post(`/logout`)
      .then(res => {
      history.push("/login");
        clearStorage();
        dispatch({ type: "LOGOUT" });
      })
      .catch(res => console.log(res.response));
  };
}

export function register(user,history) {
  return function(dispatch) {
    return callRegisterApi(user)
      .then(result => {
        history.push('/login')
      }).catch((err) => {
        return err.response.data.message;
      })

  };
}

export function login(user,history) {
  return function(dispatch) {
    return callLoginApi(user)
      .then(result => {
        setJwtToStorage(result.data.token); 
        history.push('/')
      },(err) => {
        console.log(err)
        return err.response.data.message;
      })
  }
}

export function loadUserInfo(history) {
  return function(dispatch) {
    return callGetUserInfoApi()
      .then(result => {
        dispatch(loadUser(result.data));
      }).catch((err) => {
        history.push('/login')
      })

  };
}

export function loadUser(data){
  return{
    type: LOAD_USERINFO,
    user: data
  }
}

function callRegisterApi(user) {
  var promise = new Promise(function(resolve, reject) {
    api
      .post(`/register`, user)
      .then(res => {
        resolve(res);
      })
      .catch(res => {
        reject(res);
      });
  });
  return promise;
}

export function updateEmail(value){
  return function(dispatch) {
    return callEmailUpdateApi(value)
      .then(result => {
        dispatch({type:UPDATE_EMAIL,value:value})
        return {message:result.data.message,type:"success"}
      },(err) => {
        return {message:"Email is already in use",type:"error"}
      })

  }
}

export function updatePassword(currentPass, newPass){
  return function(dispatch) {
    return callPasswordUpdateApi(currentPass, newPass)
      .then(result => {
        return {message:result.data.message,type:"success"}
      },(err) => {
        return {message:err.response.data.message,type:"error"}
      })

  }
}

export function updateDisplayedName(value){
  return function(dispatch) {
    return callUpdateDisplayedNameApi(value)
      .then(result => {
        dispatch({type:UPDATE_DISPLAYEDNAME,value:value})
        return {message:result.data.message,type:"success"}
      },(err) => {
        return {message:err.response.data.message,type:"error"}
      })
  }
}

export function forgotPassword(email){
  return function(dispatch) {
    return callForGotPasswordApi(email)
    .then(result => {
      return {message:result.data.message,type:"success"}
    },(err) => {
      return {message:err.response.data.message,type:"error"}
    })
  }
}

export function preResetPassword(authenticate,history){
  return function(dispatch) {
    return callPreResetPasswordApi(authenticate)
    .then(result => {
      return true;
    },(err) => {
      history.push('/404')
      return false;
    })
  }
}

export function resetPassword(data,history){
  return function(dispatch) {
    return callResetPasswordApi(data.authentication, data.password)
    .then(result => {
      console.log(result);
      return {message:result.data.message,type:"success"}
    },(err) => {
      console.log(err)
      return {message:err.response.data.message,type:"error"}
    })
  }
}

function callPreResetPasswordApi(authenticate){
  var promise = new Promise(function(resolve, reject) {
    api
      .get(`/resetpassword/${authenticate}`)
      .then(res => {
        resolve(res);
      })
      .catch(res => {
        reject(res);
      });
  });
  return promise;
}


function callResetPasswordApi(authenticate,password){
  var promise = new Promise(function(resolve, reject) {
    api
      .post(`/resetpassword/${authenticate}`,{newpassword:password})
      .then(res => {
        resolve(res);
      })
      .catch(res => {
        reject(res);
      });
  });
  return promise;
}

function callForGotPasswordApi(email){
  var promise = new Promise(function(resolve, reject) {
    api
      .post(`/resetpassword/`, email)
      .then(res => {
        resolve(res);
      })
      .catch(res => {
        reject(res);
      });
  });
  return promise;
}

function callLoginApi(user) {
  var promise = new Promise(function(resolve, reject) {
    api
      .post(`/login`, user)
      .then(res => {
        resolve(res);
      })
      .catch(res => {
        reject(res);
      });
  });
  return promise;
}

function callGetUserInfoApi() {
  var promise = new Promise(function(resolve, reject) {
    api
      .get(`/user`)
      .then(res => {
        callGetUserRankApi()
        .then(result=>{
          res.data.userInfo.ranking = result.data.ranking.ranking
          resolve(res);
        })
      })
      .catch(res => {
        reject(res);
      });
  });
  return promise;
}

function callGetUserRankApi() {
  var promise = new Promise(function(resolve, reject) {
    api
      .get(`/user/ranking`)
      .then(res => {
        resolve(res);
      })
      .catch(res => {
        reject(res);
      });
  });
  return promise;
}

function callUpdateDisplayedNameApi(value) {
  var promise = new Promise(function(resolve, reject) {
    api
      .post(`/user/name`,{name:value})
      .then(res => {
        resolve(res);
      })
      .catch(res => {
        reject(res);
      });
  });
  return promise;
}

function callEmailUpdateApi(value) {
  var promise = new Promise(function(resolve, reject) {
    api
      .post(`/user/email`,{email:value})
      .then(res => {
        resolve(res);
      })
      .catch(res => {
        reject(res);
      });
  });
  return promise;
}

function callPasswordUpdateApi(currentPass, newPass) {
  var promise = new Promise(function(resolve, reject) {
    api
      .post(`/user/password`,{currentpassword:currentPass,newpassword:newPass})
      .then(res => {
        resolve(res);
      })
      .catch(res => {
        reject(res);
      });
  });
  return promise;
}
