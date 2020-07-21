import React, { useEffect } from 'react';
import './App.css';
import Riskgraph from './Riskgraph.js';
import Form from './Form.js';
import InfoDialog from './InfoDialog.js';
import {AutoSizer} from 'react-virtualized';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import {CssBaseline,createMuiTheme} from "@material-ui/core";
import Card from '@material-ui/core/Card';

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: '#fb8c00',
    },
    secondary: {
      main: '#ffa726',
    },
  }
});

const viewportContext = React.createContext({});

const ViewportProvider = ({ children }) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  );
};

const useViewport = () => {
  const { width, height } = React.useContext(viewportContext);
  return { width, height };
};


const MyComponent = ({lines, handleFormSubmitted}) => {
  const { width, height } = useViewport();
  const breakpoint = 600;
  return width >= 1024 ? <DesktopComponent lines= {lines} handleFormSubmitted = {handleFormSubmitted}/> : height < breakpoint ? <MobileLowHeightComponent lines= {lines} handleFormSubmitted = {handleFormSubmitted}/> : <MobileComponent lines= {lines} handleFormSubmitted = {handleFormSubmitted}/>;
};
function App() {
  const [lines,setLines] = React.useState([])

  useEffect(() => {
    if(lines.length === 0){
      setLines(JSON.parse(localStorage.getItem("lines")))
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("lines",JSON.stringify(lines))
  }, [lines]);

  const handleFormSubmitted = (data) =>{
  fetch("/BSCalcu/graphLines", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  }).then(res => res.json()).then(data => {
    setLines(data)
  });

}
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline/>
        <InfoDialog/>
        <ViewportProvider >
          <MyComponent lines= {lines} handleFormSubmitted = {handleFormSubmitted}/>
        </ViewportProvider>
      </ThemeProvider>
    </div>
   );
}
function DesktopComponent({lines,handleFormSubmitted}) {
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "grid",
      height: "100%",
      width: "100%",
      position: "absolute",
      right: "0",
      top: "0",
      gridTemplateColumns: "2.5% 2.5% 15% 15% 2.5% 2.5% auto 15% 15% 2.5% 2.5%",
      gridTemplateRows: "2.5% 2.5% 20% 50% 20% 2.5% 2.5%",
    },
    baseCard: {
      gridColumn: "2 / 11",
      gridRow: "2/7",
      borderRadius: "50px",
    },
    formDiv: {
      gridColumn: "3 / 5",
      gridRow: "3/6",
    },
    graphDiv: {
      gridColumn: "6 / 10",
      gridRow: "3/6",
      paddingLeft: "1%",
      paddingRight: "3%",
      paddingTop: "3%",
      paddingBottom: "1%",
    }
  }));
  const classes = useStyles();

  return (
    <div className={classes.root}>
    <Card className={classes.baseCard}>
    </Card>
      <div className={classes.formDiv}>
      <AutoSizer>
        {({height, width}) => (
            <Form height = {height} width = {width} handleFormSubmitted = {handleFormSubmitted}/>
        )}
      </AutoSizer>
      </div>
      <div className={classes.graphDiv}>
        <AutoSizer>
          {({height, width}) => (
            <Riskgraph lines = {lines} height = {height} width = {width} />
          )}
        </AutoSizer>
      </div>
    </div>
  );
}

function MobileComponent({lines,handleFormSubmitted}) {
  return (
    <div>
        <section>
          <AutoSizer>
            {({height, width}) => (
                <Form height = {height} width = {width} handleFormSubmitted = {handleFormSubmitted}/>
            )}
          </AutoSizer>
        </section>
        <section>
            <AutoSizer>
              {({height, width}) => (
                <Riskgraph lines = {lines} height = {height} width = {width}/>
              )}
            </AutoSizer>
        </section>
    </div>
  );
}

function MobileLowHeightComponent({lines,handleFormSubmitted}) {

  const divStyle = {
  height:"600px",
  };


  return (
    <div>
      <div style={divStyle}>
        <AutoSizer>
          {({height, width}) => (
              <Form height = "512px" width = {width} handleFormSubmitted = {handleFormSubmitted}/>
          )}
        </AutoSizer>
      </div>
      <div style={divStyle}>
          <AutoSizer>
            {({height, width}) => (
              <Riskgraph lines = {lines} height = "512px" width = {width}/>
            )}
          </AutoSizer>
      </div>
    </div>
  );
}


export default App;

