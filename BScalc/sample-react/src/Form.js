import React, { useState, useEffect } from 'react';
import 'date-fns';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import Grid from '@material-ui/core/Grid';

const callputs = [
{
  value: 'CALL',
  label: 'Call',
},
{
  value: 'PUT',
  label: 'Put',
},
];

export default function Form({handleFormSubmitted,height,width}) {
  const [open, setOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      height: height,
      width: width,
    },
    form: {
      display: "flex",
      padding: "2%",
    },
    item: {
      display: "flex",
      flexGrow: 1,
    }
  }));
  const classes = useStyles();
  const getDate = (num) => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+num;
    var yyyy = today.getFullYear();
    if(mm < 10){
      return `0${mm}/${dd}/${yyyy}`
    }
    else{
      return `${mm}/${dd}/${yyyy}`
    }
  }
  const [values, setValues] = React.useState({
    strikeprice: '10000',
    spotprice: '10000',
    domesticInterestrate: '0',
    foreignInterestrate: '0',
    volatility: '55',
    quantity: '5',
    premium: '1098.101',
    cashflow: '5490.505',
    unitDelta: '0.554905',
    optionDelta: '2.774525',
    startDate: getDate(1),
    expirationdate: getDate(4),
    callput: 'CALL',
  });
  useEffect(() => {
    if(localStorage.length < 1){
      localStorage.setItem("values",JSON.stringify({
        strikeprice: '10000',
        spotprice: '10000',
        domesticInterestrate: '0',
        foreignInterestrate: '0',
        volatility: '55',
        quantity: '5',
        premium: '1098.101',
        cashflow: '5490.505',
        unitDelta: '0.554905',
        optionDelta: '2.774525',
        startDate: getDate(1),
        expirationdate: getDate(4),
        callput: 'CALL',
      }))
    }

    setValues(JSON.parse(localStorage.getItem("values")))
  }, []);


  const handleChange = (prop) => (event,date) => {
    if(prop === 'startDate' || prop === 'expirationdate'){
      setValues({ ...values, [prop]: date });
    }
    else{
      setValues({ ...values, [prop]: event.target.value });
    }
  };
  const convertToString = (list) => {
    Object.keys(list).map((item,index) => {
      list[item] = list[item].toString()
    });

    return list
  }

  const compareValues = (list) => {
    let prevValues = JSON.parse(localStorage.getItem("values"))
    let change = ""
    let tempList = list
    Object.keys(prevValues).map((item,index) => {
      let currItem = tempList[item]
      if(item == 'premium' && currItem != prevValues[item] && change === ""){
        let tempVal = Number(tempList["premium"]) * Number(tempList['quantity'])
        tempList['cashflow'] = tempVal
        change = 'premium'
      }
      else if(item == 'cashflow' && currItem != prevValues[item] && change === ""){
        let tempVal = Number(tempList["cashflow"])/Number(tempList['quantity'])
        tempList['premium'] = tempVal
        change = 'cashflow'
      }
    })
    return [change, tempList]
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    let change = compareValues(values)
    if(change[0] == "premium" || change[0] == "cashflow"){
      fetch("/BSCalcu/impliedVol", {
        method: "POST",
        body: JSON.stringify(change[1]),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }).then(res => {
        if(!res.ok){
          res.json().then(data => {
            setErrorMessage(data.error.error_user_msg)
            setValues(JSON.parse(localStorage.getItem("values")))
  
          });
          setOpen(true)
        }
        else{
          res.json().then(data => {
            data = convertToString(data)
            handleFormSubmitted(data)
            setValues(data)
            localStorage.setItem("values",JSON.stringify(data))
          });
        }
      });
    }
    else{
      fetch("/BSCalcu/premium", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      }).then(res => {
        if(!res.ok){
          res.json().then(data => {
            setErrorMessage(data.error.error_user_msg)
            setValues(JSON.parse(localStorage.getItem("values")))
          });
          setOpen(true)
        }
        else{
          res.json().then(data => {
            data = convertToString(data)
            handleFormSubmitted(data)
            setValues(data)
            localStorage.setItem("values",JSON.stringify(data))
          });
        }
      });
    }
  }
  return (
    <div className={classes.root}>
    <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
      <Alert onClose={() => setOpen(false)} severity="warning">
        {errorMessage}
      </Alert>
    </Snackbar>
      <form onSubmit={handleSubmit} className={classes.form}>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <FormControl className = {classes.item} variant="outlined">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    id="date-picker-dialog"
                    label="Start Date"
                    format="MM/dd/yyyy"
                    value={values.startDate}
                    onChange={handleChange('startDate')}
                  />
              </MuiPickersUtilsProvider>
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl  className = {classes.item} variant="outlined">
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDatePicker
                    id="date-picker-dialog"
                    label="End Date"
                    format="MM/dd/yyyy"
                    value={values.expirationdate}
                    onChange={handleChange('expirationdate')}
                  />
              </MuiPickersUtilsProvider>
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl className = {classes.item} variant="outlined">
            <InputLabel htmlFor="strike-price">Strike Price</InputLabel>
            <OutlinedInput
              id="strike-price"
              value={values.strikeprice}
              onChange={handleChange('strikeprice')}
              endAdornment={<InputAdornment position="end">¥</InputAdornment>}
              label = "Strike Price"
            />
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl  className = {classes.item} variant="outlined">
            <InputLabel htmlFor="spot-price">Spot Price</InputLabel>
            <OutlinedInput
              id="spot-price"
              value={values.spotprice}
              onChange={handleChange('spotprice')}
              endAdornment={<InputAdornment position="end">¥</InputAdornment>}
              label = "Spot Price"
            />
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl className = {classes.item} variant="outlined">
            <InputLabel htmlFor="foreign-interest">Foreign Interest</InputLabel>
            <OutlinedInput
              id="foreign-interest"
              value={values.foreignInterestrate}
              onChange={handleChange('foreignInterestrate')}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
              label = "Foreign Interest"
            />
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl  className = {classes.item} variant="outlined">
            <InputLabel htmlFor="domestic-interest">Domestic Interest</InputLabel>
            <OutlinedInput
              id="domestic-interest"
              value={values.domesticInterestrate}
              onChange={handleChange('domesticInterestrate')}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
              label="Domestic Interest"
            />
          </FormControl>
          </Grid>
          <Grid item xs={12}>
          <FormControl className = {classes.item} variant="outlined">
            <InputLabel htmlFor="volatility">Volatility</InputLabel>
            <OutlinedInput
              id="volatility"
              value={values.volatility}
              onChange={handleChange('volatility')}
              endAdornment={<InputAdornment position="end">%</InputAdornment>}
              label = "Volatility"
            />
          </FormControl>
          </Grid>
          <Grid item xs={6} sm = {12}>
          <FormControl className = {classes.item} variant="outlined">
            <TextField
               id="callput"
               select
               label="Option Type"
               value={values.callput}
               onChange={handleChange('callput')}
               variant="outlined"
             >
             {callputs.map((option) => (
               <MenuItem key={option.value} value={option.value}>
                 {option.label}
               </MenuItem>
             ))}
           </TextField>
          </FormControl>
          </Grid>
          <Grid item xs={6} sm = {12}>
          <FormControl className = {classes.item} variant="outlined">
            <InputLabel htmlFor="quantity">Quantity</InputLabel>
            <OutlinedInput
              id="quantity"
              value={values.quantity}
              onChange={handleChange('quantity')}
              label = "Quantity"
            />
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl className = {classes.item} variant="outlined">
            <InputLabel htmlFor="premium">Premium</InputLabel>
            <OutlinedInput
              id="premium"
              value={values.premium}
              onChange={handleChange('premium')}
              endAdornment={<InputAdornment position="end">¥</InputAdornment>}
              label = "Premium"
            />
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl className = {classes.item} variant="outlined">
            <InputLabel htmlFor="cashflow">Cashflow</InputLabel>
            <OutlinedInput
              id="cashflow"
              value={values.cashflow}
              onChange={handleChange('cashflow')}
              endAdornment={<InputAdornment position="end">¥</InputAdornment>}
              label = "Cashflow"
            />
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl  className = {classes.item} variant="outlined">
            <InputLabel htmlFor="unitDelta">Unit Delta</InputLabel>
            <OutlinedInput
              disabled
              id="unitDelta"
              value={values.unitDelta}
              onChange={handleChange('unitDelta')}
              label = "Unit Delta"
            />
          </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl className = {classes.item} variant="outlined">
            <InputLabel htmlFor="optionDelta">Option Delta</InputLabel>
            <OutlinedInput
              disabled
              variant = "outlined-disabled"
              id="optionDelta"
              value={values.optionDelta}
              onChange={handleChange('optionDelta')}
              labelWidth={90}
            />
          </FormControl>
          </Grid>
          <Grid item xs={12}>
          <FormControl className = {classes.item}>
            <Button
              type = "submit"
              size="large"
              variant="outlined">
              Calculate
            </Button>
          </FormControl>
          </Grid>
          </Grid>
      </form>
    </div>
  );
}

