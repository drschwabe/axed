const { log } = console
const {  find, isError, isUndefined } = require('lodash')
const axios = require('axios') 

const axed = {
  _options : null
}

//fn for applying options: 
const options = optionsObj => axed._options = optionsObj

//wrapper for condensed axios post calls + some 
//basic err handling such that the value returned
//is either successful response data OR the failed response
const posted = (url, body, options) => 
  new Promise( async r => {
    let res 
    if(!options) options = axed._options 
    try { 
      res = await axios.post(url, body, options)   
    } catch (err) { res = err } 
    let error = errorHappened(res) 
    if(error){
      log(error)
      return r(res)
    }
    r(res.data)
  }
) 

const gotten = (url, body, options) => 
  new Promise( async r => {
    let res 
    if(!options) options = axed._options 
    try { 
      res = await axios.get(url, body, options)   
    } catch (err) { res = err } 
    let error = errorHappened(res) 
    if(error){
      log(error)
      return r(res)
    }
    r(res.data)
  }
)   

//Parse the error and return a string summarizing what happened: 
//(ie: template ready error string) 
const errorHappened = axRes => {
  let error = true 
  if(!isError(axRes)) error = false 
  //extra check for data.error: 
  if(axRes.data && axRes.data.error) error = true  
  if(!error) return null  //< there was no err 

  error = 'An error happened'  
  const { response } = axRes
  if(!response) {
    error = error + '; no response was received'  
    if(isUndefined(axRes)) {
      error = error + ' and the result was undefined; no further info.'
      return error
    }
    if(axRes.code) {
      error = error + `. code: ${axRes.code}
Log the axRes for more verbose info on this AxiosError`
    }
    return error
  }
  if(response.status) error = error + ` (${response.status})`
  if(response.statusText) error = error + ` [${response.statusText}])` 
  //try parsing json for more specific msg:
  const { data } = response
  if(!data) return error
  if(data.code) error = error + ': ' + data.code      
  if(data.error) error = error + ' - ' + data.error
  if(!data.error && data.msg) error = error + ' - ' + data.msg
  return error
} 


module.exports = { options, errorHappened, posted, axios, gotten } 
   
