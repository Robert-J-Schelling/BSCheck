import QuantLib as ql

def transform_quantlib_callput(callput):
    if(callput == 1):
        stringCallput = "CALL"
    elif(callput == -1):
        stringCallput = "PUT"
    return stringCallput


def transform_quantlib_dates(qlDate):
    month,day,year = "","",""
    if(len(str(qlDate.month())) < 2):
        month = "0" + str(qlDate.month())
    else:
        month = str(qlDate.month())
    if(len(str(qlDate.dayOfMonth())) < 2):
        day = "0" + str(qlDate.dayOfMonth())
    else:
        day = str(qlDate.dayOfMonth())
    year = str(qlDate.year())
    qlDate_string = month + "/" + day + "/" + year
    return qlDate_string

