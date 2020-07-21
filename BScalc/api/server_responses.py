root_not_bracketed_error ={
   "error": {
     "message": "Error that occurs when implied volatility < 0.00001 or implied volatility > 500",
     "type": "RuntimeError",
     "code": '001',
     "error_user_title": "Root Not Bracketed",
     "error_user_msg": "Please make sure implied volatility isnt too large or too small!"
   }
 }

value_error ={
   "error": {
     "message": "Error related to wrong input in the form.",
     "type": "ValueError",
     "code": '002',
     "error_user_title": "Incorrect Values Submitted",
     "error_user_msg": "Please make sure all values are valid!"
   }
 }

request_not_json_error ={
   "error": {
     "message": "Error that occurs when the request sent is not in json format.",
     "type": "ValueError",
     "code": '003',
     "error_user_title": "Request Not In JSON Format",
     "error_user_msg": "Requests sent to the server have to be in JSON format."
   }
 }

missing_key_error ={
   "error": {
     "message": "Error related to missing key/value in form.",
     "type": "KeyError",
     "code": '004',
     "error_user_title": "Value or Key is missing in form.",
     "error_user_msg": "Make sure all values are present and named correctly!"
   }
 }

strike_outside_of_domain_curve_error ={
   "error": {
     "message": "Error caused by too large/small values in Strike or Spot Price.",
     "type": "RuntimeError",
     "code": '005',
     "error_user_title": "Strike or Spot Value too Large/Small",
     "error_user_msg": "The Strike/Spot Price you entered is too large/small!"
   }
 }


