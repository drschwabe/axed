const { log } = console
const { isError, isUndefined, find } = require('lodash')
const axios = require('axios') 

const axed = {
  _options : null
}

//fn for applying options: 
const options = optionsObj => axed._options = optionsObj

//wrapper for condensed axios post calls + err handling 
//error assignment triggers re-render in Svelte 
//(so ur error can be reflected)
//or return value directly if success    
const posted = (url, bodyOrError, optionsOrError, error) => 
  new Promise( async r => {
  //accommodate for params being a body obj, 
  //Axios options obj, or blank err variable:  
  if(_.isNull(bodyOrError) || _.isUndefined(bodyOrError)) { 
    //^ empty var suppplied means its intended for error 
    body = null
    options = null 
    error = null 
  }
  if(_.isObject(optionsOrError)) {
    //if not supplying a body but setting options then we must set body to null
    ////ie- posted('string', null, options) 
    //todo: parse optionts obj for axios properties so 
    //that we need not supply null body
    options = optionsOrError 
  }
  let options = optionsOrError
  
  let res 
  try { 
    res = await axios.post( 
      `${baseURL()}${url}`, body, options
    )   
  } catch (err) { res = err } 
  error = errorHappened(res) 
  if(error) return r(null) 
  r(res.data)
}) 

const errorHappened = axRes => {
  if(!isError(axRes)) return null  //< there was no err 
  let error = 'An error happened'  
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
  log(error)
  return error
} 


module.exports = { options, errorHappened, posted } 
   
