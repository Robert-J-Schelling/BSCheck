import QuantLib as ql
import os
import math
import sys
import server_responses

def calculate_graphLines(values):
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

        premium = float(european_option.NPV())

        x_axis_values,premium_values,intrinsic_values = [],[],[]
        max_value,min_value = create_range(values)
        x_axis_values = create_x_axis_values(max_value,min_value,values)
        premium_values = create_premium_values(x_axis_values,premium,values)
        intrinsic_values = get_intrinsic_values(x_axis_values,premium,values)

        return x_axis_values,premium_values,intrinsic_values, None
    except Exception as e:
        message = 'Unkown Error Occured'
        if 'KeyError' in repr(e):
            message = server_responses.missing_key_error
        elif 'strike (inf)' in repr(e):
            message = server_responses.strike_outside_of_domain_curve_error
        elif 'ValueError' in repr(e):
            message = server_responses.value_error

        return None,None,None,message

def create_range(values):
    day_count = ql.ActualActual().dayCount(values["startDate"], values["expirationdate"])
    standard_deviation = values["spotprice"] * values["volatility"] * (math.sqrt(day_count/365))

    max_value = values["spotprice"] + (standard_deviation * 2)
    min_value = values["spotprice"] - (standard_deviation * 2)
    if(min_value < 0):
        min_value = 0
    return max_value,min_value

def create_x_axis_values(max_value,min_value,values):
    datapoints = 30
    range = max_value - min_value
    break_even_point = values["strikeprice"]
    interval = range/datapoints

    x_axis_values = []

    i = 1
    while(i <= datapoints):
        x_axis_values.append(min_value + (interval * i))
        i = i + 1

    x_axis_values.append(break_even_point)
    x_axis_values.sort()
    return x_axis_values

def create_premium_values(x_axis_values,premium,values):
    values_array = []

    for item in x_axis_values:
        spot_rate = item
        settlement_date = values["startDate"]
        days = ql.Actual365Fixed()
        calendar = ql.Japan()
        frequency = ql.Annual
        ql.Settings.instance().evaluationDate = values["startDate"]

        compounding = ql.Compounded

        payoff = ql.PlainVanillaPayoff(values["callput"], values["strikeprice"])

        eu_exercise = ql.EuropeanExercise(values["expirationdate"])
        european_option = ql.VanillaOption(payoff,eu_exercise)

        spot_handle = ql.QuoteHandle(ql.SimpleQuote(spot_rate))
        rTS = ql.YieldTermStructureHandle(ql.FlatForward(settlement_date,values["domesticInterestrate"], days,compounding, frequency))
        fTS = ql.YieldTermStructureHandle(ql.FlatForward(settlement_date,values["foreignInterestrate"], days,compounding, frequency))
        flat_vol_ts = ql.BlackVolTermStructureHandle(ql.BlackConstantVol(settlement_date, calendar, values["volatility"], days))
        garman_kohlagen_process = ql.GarmanKohlagenProcess(spot_handle, fTS, rTS, flat_vol_ts)

        engine = ql.AnalyticEuropeanEngine(garman_kohlagen_process)

        european_option.setPricingEngine(engine)

        values_array.append(float(european_option.NPV()))

    if values["callput"] == ql.Option.Call:
        for i in range(0,len(values_array)):
            values_array[i] = values_array[i] - premium
    else:
        for i in range(0,len(values_array)):
            values_array[i] = values_array[i] - premium
    premium_values = values_array
    return premium_values

def get_intrinsic_values(x_axis_values,premium,values):
    intrinsic_values = []
    if values["callput"] == ql.Option.Call:
        for item in x_axis_values:
            if(item <= values["strikeprice"]):
                intrinsic_values.append(-premium)
            if(item > values["strikeprice"]):
                intrinsic_values.append((item - values["strikeprice"] - premium))
    else:
        for item in x_axis_values:
            if(item >= values["strikeprice"]):
                intrinsic_values.append(-premium)
            if(item < values["strikeprice"]):
                intrinsic_values.append((values["strikeprice"] - item - premium))
    return intrinsic_values

