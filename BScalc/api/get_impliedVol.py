import QuantLib as ql # version 1.5
import matplotlib.pyplot as plt
import server_responses
#https://quant.stackexchange.com/questions/33604/pricing-of-a-foreign-exchange-vanilla-option
#https://stackoverflow.com/questions/48778712/fx-vanilla-call-price-in-quantlib-doesnt-match-bloomberg

def set_values(values):
    try:
        settlement_date = values["startDate"]
        days = ql.Actual365Fixed()
        calendar = ql.Japan()
        frequency = ql.Annual
        ql.Settings.instance().evaluationDate = values["startDate"]

        compounding = ql.Compounded

        payoff = ql.PlainVanillaPayoff(values["callput"], values["strikeprice"])

        eu_exercise = ql.EuropeanExercise(values["expirationdate"])
        european_option = ql.VanillaOption(payoff,eu_exercise)

        spot_handle = ql.QuoteHandle(ql.SimpleQuote(values["spotprice"]))
        rTS = ql.YieldTermStructureHandle(ql.FlatForward(settlement_date,values["domesticInterestrate"], days,compounding, frequency))
        fTS = ql.YieldTermStructureHandle(ql.FlatForward(settlement_date,values["foreignInterestrate"], days,compounding, frequency))
        flat_vol_ts = ql.BlackVolTermStructureHandle(ql.BlackConstantVol(settlement_date, calendar, values["volatility"], days))
        garman_kohlagen_process = ql.GarmanKohlagenProcess(spot_handle, fTS, rTS, flat_vol_ts)

        engine = ql.AnalyticEuropeanEngine(garman_kohlagen_process)

        european_option.setPricingEngine(engine)
        vol = float(european_option.impliedVolatility(values["premium"], garman_kohlagen_process,0.000000001,minVol = 0.00001, maxVol = 5.0)*100)
        flat_vol_ts = ql.BlackVolTermStructureHandle(ql.BlackConstantVol(settlement_date, calendar, vol/100, days))
        garman_kohlagen_process = ql.GarmanKohlagenProcess(spot_handle, fTS, rTS, flat_vol_ts);
        engine = ql.AnalyticEuropeanEngine(garman_kohlagen_process)
        european_option.setPricingEngine(engine)
        return round(float(values["premium"]),3) , floatrounding(float(european_option.delta())) , floatrounding(vol), None
    except Exception as e:
        message = 'Unkown Error Occured'

        if 'root not bracketed' in repr(e):
            message = server_responses.root_not_bracketed_error
        elif 'ValueError' in repr(e):
            message = server_responses.value_error
        if 'KeyError' in repr(e):
            message = server_responses.missing_key_error

        return None,None,None,message

def floatrounding(num):
    return float("{:.6f}".format(num))

