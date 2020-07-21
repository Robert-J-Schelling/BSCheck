from flask import Flask, redirect, url_for, render_template, request,jsonify,send_file
from flask_cors import CORS
import QuantLib as ql
import get_premium
import get_impliedVol
import quantlibVal_transformer
import get_graphLines
import server_responses
import math
app = Flask(__name__)
CORS(app)

def change_valueFormat(values,premium,delta,volatility):
    values["startDate"] = quantlibVal_transformer.transform_quantlib_dates(values["startDate"])
    values["expirationdate"] = quantlibVal_transformer.transform_quantlib_dates(values["expirationdate"])
    values["callput"] = quantlibVal_transformer.transform_quantlib_callput(values["callput"])
    values["premium"] = premium
    print(delta)
    if(math.isnan(delta)):
        values["unitDelta"] = 0
    else:
        values["unitDelta"] = round(delta,4)
    values["optionDelta"] = round((values["unitDelta"] * values['quantity']),4)
    values["volatility"] = volatility
    values["cashflow"] = round((premium * values['quantity']),3)
    values['domesticInterestrate'] = values['domesticInterestrate'] * 100
    values['foreignInterestrate'] = values['foreignInterestrate'] * 100
    return values

def check_values(request):
    if request.is_json:
        # Parse the JSON into a Python dictionary
        values = request.get_json(force=True)
        try:
            for item in values:
                if values[item] == '':
                    values[item] = '0'

            spot_rate = float(values.get('spotprice',0))
            strike_rate = float(values.get('strikeprice',0))
            domestic_interest_rate = float(values.get('domesticInterestrate',0))/100
            foreign_interest_rate = float(values.get('foreignInterestrate',0))/100
            volatility = float(values.get('volatility',0))/100
            expiration_date = ql.Date(int(values.get('expirationdate',0)[3:5]),int(values.get('expirationdate',0)[0:2]),int(values.get('expirationdate',0)[6:10]))
            start_date = ql.Date(int(values.get('startDate',0)[3:5]),int(values.get('startDate',0)[0:2]),int(values.get('startDate',0)[6:10]))
            premium = float(values.get('premium',0))
            cashflow = float(values.get('cashflow',0))
            quantity = float(values.get('quantity',0))

            if(values['callput'] == 'CALL'):
                option_type = ql.Option.Call
            elif(values['callput'] == 'PUT'):
                option_type = ql.Option.Put
            else:
                raise Exception('callput', 'invalid value')


            return {"spotprice": spot_rate,
                    "strikeprice": strike_rate,
                    "domesticInterestrate":domestic_interest_rate,
                    "foreignInterestrate":foreign_interest_rate,
                    "volatility":volatility,
                    "expirationdate":expiration_date,
                    "startDate":start_date,
                    "premium":premium,
                    "cashflow":cashflow,
                    "callput":option_type,
                    "quantity": quantity}

        except Exception as e:
            print(repr(e))
            if 'ValueError' in repr(e):
                return {"message": server_responses.value_error, "code":400}
            if 'KeyError' in repr(e):
                return {"message": server_responses.missing_key_error, "code" : 400}

            return {"message":"There is a problem with your data","code": 400}
    else:

        # The request body wasn't JSON so return a 400 HTTP status code
        return {"message": "Request was not JSON", "code":400}


@app.route('/BSCalcu/premium', methods=('GET', 'POST'))
def premium():

    if request.method == 'POST':
        values = check_values(request)
        if(len(values) == 2):
            return values["message"], values["code"]
        else:
            premium,delta,volatility,message = get_premium.set_values(values)
            if(message == None):
                return change_valueFormat(values, premium, delta, volatility)
            else:
                return message, 400
                

@app.route('/BSCalcu/impliedVol', methods=('GET', 'POST'))
def impliedVol():

    if request.method == 'POST':
        values = check_values(request)
        print(values)
        if(len(values) == 2):
            return values["message"], values["code"]
        else:
            premium,delta,volatility,message = get_impliedVol.set_values(values)
            if(message == None):
                return change_valueFormat(values, premium, delta, volatility)
            else:
                return message, 400

@app.route('/BSCalcu/graphLines', methods=('GET', 'POST'))
def graphLines():

    if request.method == 'POST':
        values = check_values(request)
        if(len(values) == 2):
            return values["message"], values["code"]
        else:
            x_axis_vals,premium_vals,intrinsic_vals,message = get_graphLines.calculate_graphLines(values)
            if(message == None):
                lines = []

                for x, p, i in zip(x_axis_vals, premium_vals,intrinsic_vals):
                    lines.append({'x' : x,'p' : p, 'i' : i})

                return jsonify(lines)
            else:
                return message, 400
    else:
        return

if __name__ == '__main__':
    app.run(host= '0.0.0.0')
