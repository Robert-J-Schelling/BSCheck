import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

export default function InfoDialog() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            <b>BLACK SCHOLES CALCULATOR</b>
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
          Hello! This calculator will help you determine the price (premium) of a
          European put or call option based on the Black-Scholes pricing model.
          It will also calculate the value of Delta for you. Just fill up the form
          with your own values and press "calculate" button.
          <br></br>
          <br></br>
          </Typography>
          <Typography gutterBottom>
          <b>Implied Volatility</b><br></br>
          You can also calculate implied volatility. Simply enter a value into the
          fields labelled premium or cashflow and press the "calculate" button. The
          volatility is returned up to six significant digits after the comma. If
          both premium and Cashflow have been edited, premium will take precedence.
          <br></br>
          <br></br>
          </Typography>
          <Typography gutterBottom>
          <b>Profit/Loss Graph</b><br></br>
          The Y-Axis represents profit/loss, and the X-Axis represents the underlying
          price of your stock/currency. The graph visualizes at what prices you will
          lose money, break even or make profits.
          <br></br>
          <br></br>
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  );
}
